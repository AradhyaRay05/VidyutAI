import os
from datetime import datetime, timedelta
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get("DATABASE_URL")


class PostgresDatabase:
    def __init__(self):
        if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
            self.dsn = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        else:
            self.dsn = DATABASE_URL
        self._init_db()

    def _get_conn(self):
        return psycopg2.connect(self.dsn, cursor_factory=RealDictCursor)

    def _init_db(self):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("""CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) DEFAULT '',
            household_size INTEGER DEFAULT 1,
            tariff_rate NUMERIC(10,2) DEFAULT 7.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        c.execute("""CREATE TABLE IF NOT EXISTS energy_data (
            record_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            timestamp VARCHAR(30) NOT NULL,
            appliance_name VARCHAR(100) NOT NULL,
            power_usage_kwh NUMERIC(10,3) NOT NULL,
            cost NUMERIC(10,2) NOT NULL,
            duration_hours NUMERIC(6,2) DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        c.execute("""CREATE TABLE IF NOT EXISTS predictions (
            prediction_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            prediction_date VARCHAR(30) NOT NULL,
            predicted_consumption_kwh NUMERIC(10,3) NOT NULL,
            predicted_cost NUMERIC(10,2) NOT NULL,
            confidence_score NUMERIC(5,4),
            prediction_type VARCHAR(20) DEFAULT 'daily',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        c.execute("CREATE INDEX IF NOT EXISTS idx_energy_user_ts ON energy_data(user_id, timestamp)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_energy_appliance ON energy_data(appliance_name)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_pred_user_date ON predictions(user_id, prediction_date)")
        conn.commit()
        conn.close()

    def get_user_by_username(self, username):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username = %s", (username,))
        row = c.fetchone()
        conn.close()
        return dict(row) if row else None

    def get_user_by_id(self, user_id):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        row = c.fetchone()
        conn.close()
        return dict(row) if row else None

    def create_user(self, username, email, password_hash, full_name, household_size=1, tariff_rate=7.0):
        conn = self._get_conn()
        try:
            c = conn.cursor()
            c.execute("INSERT INTO users (username, email, password_hash, full_name, household_size, tariff_rate) VALUES (%s, %s, %s, %s, %s, %s)",
                      (username, email, password_hash, full_name, household_size, tariff_rate))
            conn.commit()
            return True
        except Exception as e:
            print(f"create_user error: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()

    def add_energy_record(self, user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours=1.0):
        conn = self._get_conn()
        try:
            c = conn.cursor()
            c.execute("INSERT INTO energy_data (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours) VALUES (%s, %s, %s, %s, %s, %s)",
                      (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours))
            conn.commit()
            return True
        except Exception as e:
            print(f"add_energy_record error: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()

    def get_energy_data(self, user_id, start_date=None, end_date=None, limit=None):
        conn = self._get_conn()
        c = conn.cursor()
        query = "SELECT * FROM energy_data WHERE user_id = %s"
        params = [user_id]
        if start_date:
            query += " AND timestamp >= %s"
            params.append(start_date)
        if end_date:
            query += " AND timestamp <= %s"
            params.append(end_date)
        query += " ORDER BY timestamp DESC"
        if limit:
            query += f" LIMIT {int(limit)}"
        c.execute(query, params)
        rows = c.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_daily_consumption(self, user_id, days=30):
        conn = self._get_conn()
        c = conn.cursor()
        cutoff = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        c.execute("""
            SELECT DATE(timestamp::text) as date, SUM(power_usage_kwh) as total_kwh,
                   SUM(cost) as total_cost, COUNT(DISTINCT appliance_name) as appliances_used,
                   COUNT(*) as total_records
            FROM energy_data WHERE user_id = %s AND DATE(timestamp::text) >= %s::date
            GROUP BY DATE(timestamp::text) ORDER BY date DESC
        """, (user_id, cutoff))
        rows = c.fetchall()
        conn.close()
        result = []
        for r in rows:
            d = dict(r)
            if isinstance(d["date"], str):
                d["date"] = datetime.strptime(d["date"], "%Y-%m-%d")
            result.append(d)
        return result

    def get_appliance_consumption(self, user_id):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("""
            SELECT appliance_name, SUM(power_usage_kwh) as total_kwh, SUM(cost) as total_cost,
                   COUNT(*) as usage_count, AVG(power_usage_kwh) as avg_kwh_per_use
            FROM energy_data WHERE user_id = %s GROUP BY appliance_name ORDER BY total_kwh DESC
        """, (user_id,))
        rows = c.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_monthly_statistics(self, user_id, months=12):
        conn = self._get_conn()
        c = conn.cursor()
        c.execute("""
            SELECT TO_CHAR(timestamp::timestamp, 'YYYY') as year,
                   TO_CHAR(timestamp::timestamp, 'MM') as month,
                   SUM(power_usage_kwh) as total_kwh, SUM(cost) as total_cost,
                   AVG(power_usage_kwh) as avg_daily_kwh, MAX(power_usage_kwh) as peak_kwh
            FROM energy_data WHERE user_id = %s
            GROUP BY TO_CHAR(timestamp::timestamp, 'YYYY'), TO_CHAR(timestamp::timestamp, 'MM')
            ORDER BY year DESC, month DESC LIMIT %s
        """, (user_id, months))
        rows = c.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_data_as_dataframe(self, user_id, start_date=None, end_date=None):
        data = self.get_energy_data(user_id, start_date, end_date)
        return pd.DataFrame(data) if data else pd.DataFrame()

    def save_prediction(self, user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score=None, prediction_type='daily'):
        conn = self._get_conn()
        try:
            c = conn.cursor()
            c.execute("INSERT INTO predictions (user_id, prediction_date, predicted_consumption_kwh, predicted_cost, confidence_score, prediction_type) VALUES (%s, %s, %s, %s, %s, %s)",
                      (user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score, prediction_type))
            conn.commit()
            return True
        except Exception:
            conn.rollback()
            return False
        finally:
            conn.close()

    def bulk_insert(self, user_id, records):
        conn = self._get_conn()
        try:
            c = conn.cursor()
            for r in records:
                c.execute("INSERT INTO energy_data (user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours) VALUES (%s, %s, %s, %s, %s, %s)",
                          (user_id, r["timestamp"], r["appliance_name"], r["power_usage_kwh"], r["cost"], r.get("duration_hours", 1.0)))
            conn.commit()
            return True
        except Exception as e:
            print(f"bulk_insert error: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
