from pydantic import BaseModel
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = ""
    household_size: int = 1
    tariff_rate: float = 7.00


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class AddRecordRequest(BaseModel):
    appliance_name: str
    power_usage_kwh: float
    duration_hours: float = 1.0
    timestamp: Optional[str] = None


class SimulationRequest(BaseModel):
    ac_hours: float = 8.0
    fan_hours: float = 12.0
    solar_panels: int = 0
    working_hours: float = 10.0


class SimulationResponse(BaseModel):
    estimated_bill: float
    estimated_savings: float
    ac_contribution_percent: float
    fan_contribution_percent: float
    solar_saving: float
    tip: str
