import os
import sqlite3
from datetime import datetime, timedelta
import pandas as pd

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "vidyutai.db")


class SQLiteDatabase:
    def __init__(self):
        self.db_path = DB_PATH
        self._init_db()

    def _get_conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn

    def _init_db(self):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("""CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT DEFAULT '',
            household_size INTEGER DEFAULT 1,
            tariff_rate REAL DEFAULT 7.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        c.execute("""CREATE TABLE IF NOT EXISTS energy_data (
            record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            appliance_name TEXT NOT NULL,
            power_usage_kwh REAL NOT NULL,
            cost REAL NOT NULL,
            duration_hours REAL DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )""")
        c.execute("""CREATE TABLE IF NOT EXISTS predictions (
            prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            prediction_date TEXT NOT NULL,
            predicted_consumption_kwh REAL NOT NULL,
            predicted_cost REAL NOT NULL,
            confidence_score REAL,
            prediction_type TEXT DEFAULT 'daily',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )""")
        c.execute("CREATE INDEX IF NOT EXISTS idx_energy_user_ts ON energy_data(user_id, timestamp)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_energy_appliance ON energy_data(appliance_name)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_pred_user_date ON predictions(user_id, prediction_date)")
        conn.commit()
        conn.close()

    def get_user_by_username(self, username):
        conn = self._get_conn()
        row = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        return dict(row) if row else None

    def get_user_by_id(self, user_id):
        conn = self._get_conn()
        row = conn.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    def create_user(self, username, email, password_hash, full_name, household_size=1, tariff_rate=7.0):
        conn = self._get_conn()
        try:
            conn.execute("INSERT INTO users (username, email, password_hash, full_name, household_size, tariff_rate) VALUES (?, ?, ?, ?, ?, ?)",
                         (username, email, password_hash, full_name, household_size, tariff_rate))
            conn.commit()
            return True
        except Exception as e:
            print(f"create_user error: {e}")
            return False
        finally:
            conn.close()

    def add_energy_record(self, user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours=1.0):
        conn = self._get_conn()
        try:
            conn.execute("INSERT INTO energy_data (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours) VALUES (?, ?, ?, ?, ?, ?)",
                         (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours))
            conn.commit()
            return True
        except Exception as e:
            print(f"add_energy_record error: {e}")
            return False
        finally:
            conn.close()

    def get_energy_data(self, user_id, start_date=None, end_date=None, limit=None):
        conn = self._get_conn()
        query = "SELECT * FROM energy_data WHERE user_id = ?"
        params = [user_id]
        if start_date:
            query += " AND timestamp >= ?"
            params.append(start_date)
        if end_date:
            query += " AND timestamp <= ?"
            params.append(end_date)
        query += " ORDER BY timestamp DESC"
        if limit:
            query += f" LIMIT {int(limit)}"
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_daily_consumption(self, user_id, days=30):
        conn = self._get_conn()
        cutoff = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        rows = conn.execute("""
            SELECT date(timestamp) as date, SUM(power_usage_kwh) as total_kwh,
                   SUM(cost) as total_cost, COUNT(DISTINCT appliance_name) as appliances_used,
                   COUNT(*) as total_records
            FROM energy_data WHERE user_id = ? AND date(timestamp) >= ?
            GROUP BY date(timestamp) ORDER BY date DESC
        """, (user_id, cutoff)).fetchall()
        conn.close()
        result = []
        for r in rows:
            d = dict(r)
            d["date"] = datetime.strptime(d["date"], "%Y-%m-%d")
            result.append(d)
        return result

    def get_appliance_consumption(self, user_id):
        conn = self._get_conn()
        rows = conn.execute("""
            SELECT appliance_name, SUM(power_usage_kwh) as total_kwh, SUM(cost) as total_cost,
                   COUNT(*) as usage_count, AVG(power_usage_kwh) as avg_kwh_per_use
            FROM energy_data WHERE user_id = ? GROUP BY appliance_name ORDER BY total_kwh DESC
        """, (user_id,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_monthly_statistics(self, user_id, months=12):
        conn = self._get_conn()
        rows = conn.execute("""
            SELECT strftime('%Y', timestamp) as year, strftime('%m', timestamp) as month,
                   SUM(power_usage_kwh) as total_kwh, SUM(cost) as total_cost,
                   AVG(power_usage_kwh) as avg_daily_kwh, MAX(power_usage_kwh) as peak_kwh
            FROM energy_data WHERE user_id = ?
            GROUP BY strftime('%Y', timestamp), strftime('%m', timestamp)
            ORDER BY year DESC, month DESC LIMIT ?
        """, (user_id, months)).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_data_as_dataframe(self, user_id, start_date=None, end_date=None):
        data = self.get_energy_data(user_id, start_date, end_date)
        return pd.DataFrame(data) if data else pd.DataFrame()

    def save_prediction(self, user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score=None, prediction_type='daily'):
        conn = self._get_conn()
        try:
            conn.execute("INSERT INTO predictions (user_id, prediction_date, predicted_consumption_kwh, predicted_cost, confidence_score, prediction_type) VALUES (?, ?, ?, ?, ?, ?)",
                         (user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score, prediction_type))
            conn.commit()
            return True
        except Exception:
            return False
        finally:
            conn.close()

    def bulk_insert(self, user_id, records):
        conn = self._get_conn()
        try:
            conn.executemany(
                "INSERT INTO energy_data (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours) VALUES (?, ?, ?, ?, ?, ?)",
                [(user_id, r["timestamp"], r["appliance_name"], r["power_usage_kwh"], r["cost"], r.get("duration_hours", 1.0)) for r in records],
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"bulk_insert error: {e}")
            return False
        finally:
            conn.close()


db = SQLiteDatabase()
