import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "VidyutAI"
    DEBUG: bool = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vidyutai-dev-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    DEFAULT_TARIFF_RATE: float = float(os.getenv("TARIFF_RATE_DEFAULT", "7.00"))
    CO2_PER_KWH: float = 0.82
    MODEL_PATH: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "ml_models", "models")
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", ""),
    ]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
