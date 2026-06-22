import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "VidyutAI"
    DEBUG: bool = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vidyutai-dev-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    DB_HOST: str = os.getenv("MYSQL_HOST") or os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("MYSQL_PORT") or os.getenv("DB_PORT", "3306"))
    DB_NAME: str = os.getenv("MYSQL_DATABASE") or os.getenv("DB_NAME", "energy_tracker")
    DB_USER: str = os.getenv("MYSQL_USER") or os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("MYSQL_PASSWORD") or os.getenv("DB_PASSWORD", "")
    DEFAULT_TARIFF_RATE: float = float(os.getenv("TARIFF_RATE_DEFAULT", "7.00"))
    CO2_PER_KWH: float = 0.82
    MODEL_PATH: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "ml_models", "models")
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
