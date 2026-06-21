import sys
import os

_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

_db = None


class DBService:
    def __init__(self):
        self._db = None
        self._backend = None

    def _get_db(self):
        if self._db is None:
            from app.services.sqlite_db import db as sqlite_db
            self._db = sqlite_db
            self._backend = "sqlite"
            print("[DB] Using SQLite database")
        return self._db

    def get_user_by_username(self, username):
        return self._get_db().get_user_by_username(username)

    def get_user_by_id(self, user_id):
        return self._get_db().get_user_by_id(user_id)

    def create_user(self, username, email, password_hash, full_name, household_size=1, tariff_rate=7.0):
        return self._get_db().create_user(username, email, password_hash, full_name, household_size, tariff_rate)

    def get_daily_consumption(self, user_id, days=30):
        return self._get_db().get_daily_consumption(user_id, days=days)

    def get_appliance_consumption(self, user_id):
        return self._get_db().get_appliance_consumption(user_id)

    def get_monthly_statistics(self, user_id, months=12):
        return self._get_db().get_monthly_statistics(user_id, months=months)

    def get_energy_data(self, user_id, start_date=None, end_date=None, limit=None):
        return self._get_db().get_energy_data(user_id, start_date=start_date, end_date=end_date, limit=limit)

    def add_energy_record(self, user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours=1.0):
        return self._get_db().add_energy_record(user_id, timestamp, appliance_name, power_usage_kwh, cost, duration_hours)

    def get_data_as_dataframe(self, user_id):
        return self._get_db().get_data_as_dataframe(user_id)

    def save_prediction(self, user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score=None, prediction_type='daily'):
        return self._get_db().save_prediction(user_id, prediction_date, predicted_kwh, predicted_cost, confidence_score, prediction_type)

    def bulk_insert(self, user_id, records):
        return self._get_db().bulk_insert(user_id, records)


def _get_db_service():
    svc = DBService()
    svc._get_db()
    return svc


db_service = _get_db_service()
