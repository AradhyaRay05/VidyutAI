import numpy as np
from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.core.config import settings
from app.services.db_service import db_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

MOCK_DAILY = [
    {"date": f"2025-06-{i:02d}", "total_kwh": np.random.uniform(25, 38), "total_cost": np.random.uniform(175, 266)}
    for i in range(1, 21)
]

MOCK_APPLIANCES = [
    {"appliance_name": "Air Conditioner", "total_kwh": 128.5, "total_cost": 1798, "usage_count": 45, "avg_kwh_per_use": 2.86},
    {"appliance_name": "Refrigerator", "total_kwh": 54.2, "total_cost": 759, "usage_count": 30, "avg_kwh_per_use": 1.81},
    {"appliance_name": "Lighting", "total_kwh": 42.8, "total_cost": 599, "usage_count": 60, "avg_kwh_per_use": 0.71},
    {"appliance_name": "Washing Machine", "total_kwh": 28.4, "total_cost": 398, "usage_count": 12, "avg_kwh_per_use": 2.37},
    {"appliance_name": "Television", "total_kwh": 21.6, "total_cost": 302, "usage_count": 20, "avg_kwh_per_use": 1.08},
]


def _get_daily_data(user_id: int, days: int = 30):
    try:
        data = db_service.get_daily_consumption(user_id, days=days)
        if data:
            return data, True
    except Exception:
        pass
    return MOCK_DAILY[:days], False


def _get_appliance_data(user_id: int):
    try:
        data = db_service.get_appliance_consumption(user_id)
        if data:
            return data, True
    except Exception:
        pass
    return MOCK_APPLIANCES, False


@router.get("/summary")
async def dashboard_summary(days: int = 30, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    daily_data, is_real = _get_daily_data(user_id, days)
    appliance_data, _ = _get_appliance_data(user_id)

    if not daily_data:
        return {"stats": {"total_kwh": 0, "total_cost": 0, "avg_daily": 0, "peak_day": None, "carbon_kg": 0, "efficiency_score": 0, "days_analyzed": 0, "appliances_count": 0}}

    total_kwh = sum(float(d["total_kwh"]) for d in daily_data)
    total_cost = sum(float(d["total_cost"]) for d in daily_data)
    avg_daily = total_kwh / len(daily_data)
    carbon_kg = total_kwh * settings.CO2_PER_KWH
    peak_day_data = max(daily_data, key=lambda x: float(x["total_kwh"]))
    peak_day = peak_day_data["date"].strftime("%Y-%m-%d") if hasattr(peak_day_data["date"], "strftime") else str(peak_day_data["date"])
    efficiency_score = max(0, 100 - (avg_daily / 30 * 100))

    return {
        "stats": {
            "current_usage": round(total_kwh, 2),
            "predicted_usage": round(total_kwh * 1.086, 2),
            "estimated_bill": round(total_cost, 2),
            "potential_savings": round(total_cost * 0.25, 2),
            "carbon_reduction": 14.0,
            "avg_daily": round(avg_daily, 2),
            "peak_day": peak_day,
            "carbon_kg": round(carbon_kg, 2),
            "efficiency_score": round(efficiency_score, 0),
            "days_analyzed": len(daily_data),
            "appliances_count": len(appliance_data) if appliance_data else 0,
            "demo_mode": not is_real,
        }
    }


@router.get("/insights")
async def get_insights(current_user: dict = Depends(get_current_user)):
    insights = [
        {"type": "alert", "priority": "high", "icon": "warning", "title": "High Consumption Alert", "text": "Your consumption today (35.2 kWh) is 30% higher than your weekly average. Check for appliances left on."},
        {"type": "info", "priority": "medium", "icon": "lightbulb", "title": "Peak Usage Optimization", "text": "Your peak usage is typically between 6 PM - 9 PM. Consider shifting activities to off-peak hours."},
        {"type": "tip", "priority": "high", "icon": "plug", "title": "Top Energy Consumer", "text": "Air Conditioner is your highest consumer (128.5 kWh, ₹1798). Consider upgrading to an energy-efficient model."},
        {"type": "success", "priority": "high", "icon": "currency", "title": "Savings Opportunity", "text": "By reducing consumption by 15%, you could save ₹728/month. A 25% reduction could save ₹1,213/month!"},
        {"type": "info", "priority": "medium", "icon": "leaf", "title": "Environmental Impact", "text": "Your monthly carbon footprint is ~78 kg CO₂. That's equivalent to planting 4 trees to offset!"},
    ]
    return {"insights": insights}
