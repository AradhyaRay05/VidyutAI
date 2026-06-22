from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional

from app.models.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.services.db_service import db_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

DEMO_USER = {
    "user_id": 1,
    "username": "demo_user",
    "email": "demo@vidyutai.com",
    "full_name": "Demo User",
    "household_size": 3,
    "tariff_rate": 7.00,
    "password_hash": get_password_hash("password123"),
}


def _ensure_demo_user():
    existing = db_service.get_user_by_username("demo_user")
    if not existing:
        db_service.create_user(
            DEMO_USER["username"], DEMO_USER["email"], DEMO_USER["password_hash"],
            DEMO_USER["full_name"], DEMO_USER["household_size"], DEMO_USER["tariff_rate"],
        )


def _user_response(user):
    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "email": user["email"],
        "full_name": user.get("full_name", ""),
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest):
    existing = db_service.get_user_by_username(req.username)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")

    password_hash = get_password_hash(req.password)
    success = db_service.create_user(
        req.username, req.email, password_hash, req.full_name, req.household_size, req.tariff_rate,
    )
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed")

    return {"message": "User registered successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    _ensure_demo_user()

    user = db_service.get_user_by_username(req.username)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user["user_id"])})
    return TokenResponse(access_token=access_token, user=_user_response(user))


@router.get("/status")
async def auth_status(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"authenticated": False}

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if payload is None:
        return {"authenticated": False}

    user_id = payload.get("sub")
    if not user_id:
        return {"authenticated": False}

    user = db_service.get_user_by_id(int(user_id))
    if not user:
        return {"authenticated": False}

    return {"authenticated": True, "user": _user_response(user)}
