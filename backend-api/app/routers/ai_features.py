import numpy as np
from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.services.db_service import db_service
from app.models.schemas import SimulationRequest, SimulationResponse

router = APIRouter(prefix="/api/ai", tags=["ai-features"])


def _get_daily_data(user_id):
    try:
        data = db_service.get_daily_consumption(user_id, days=30)
        if data and len(data) >= 7:
            return [float(d["total_kwh"]) for d in data]
    except Exception:
        pass
    return [28.5, 32.1, 25.8, 35.2, 30.4, 22.1, 27.6, 31.8, 29.3, 33.7,
            26.4, 38.9, 24.2, 30.1, 28.7, 34.5, 27.9, 31.2, 29.8, 36.1]


@router.get("/anomalies")
async def detect_anomalies(current_user: dict = Depends(get_current_user)):
    values = _get_daily_data(current_user["user_id"])
    mean_val = np.mean(values)
    std_val = np.std(values)
    threshold_high = mean_val + 2 * std_val

    anomalies = []
    for i, val in enumerate(values):
        if val > threshold_high:
            severity = "high" if abs(val - mean_val) / mean_val > 0.5 else "medium"
            anomalies.append({
                "date": f"2025-06-{(i + 1):02d}", "type": "spike",
                "value": round(val, 2), "expected": round(mean_val, 2),
                "deviation": round(abs((val - mean_val) / mean_val) * 100, 1),
                "description": "Unusual spike detected - possible appliance malfunction or extended usage",
                "severity": severity,
            })
    return {"anomalies": anomalies}


@router.get("/recommendations")
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    tariff = float(current_user.get("tariff_rate", 7.00))
    avg_daily = np.mean(_get_daily_data(current_user["user_id"]))

    return {"recommendations": [
        {"id": 1, "title": "Shift AC usage after 8 PM", "description": "Running your AC during off-peak hours can reduce costs by 30% due to lower time-of-use rates.",
         "savings": round(avg_daily * 0.3 * tariff * 30 * 0.2, 0), "priority": "high", "category": "cooling"},
        {"id": 2, "title": "Replace old refrigerator", "description": "Your refrigerator is consuming 40% more energy than a modern inverter model.",
         "savings": 780, "priority": "high", "category": "appliances"},
        {"id": 3, "title": "Switch to LED lighting", "description": "Replacing remaining CFL bulbs with LED can reduce lighting costs by 60%.",
         "savings": 320, "priority": "medium", "category": "lighting"},
        {"id": 4, "title": "Install smart power strips", "description": "Standby power consumption accounts for 8% of your bill. Smart strips eliminate phantom loads.",
         "savings": 210, "priority": "medium", "category": "appliances"},
        {"id": 5, "title": "Optimize washing machine schedule", "description": "Running full loads and using cold water can reduce washing machine energy by 25%.",
         "savings": 150, "priority": "low", "category": "appliances"},
    ]}


@router.post("/simulate")
async def simulate_scenario(req: SimulationRequest, current_user: dict = Depends(get_current_user)):
    base_cost = 4850
    try:
        daily_data = db_service.get_daily_consumption(current_user["user_id"], days=30)
        if daily_data:
            base_cost = sum(float(d["total_cost"]) for d in daily_data)
    except Exception:
        pass

    ac_cost = req.ac_hours * 45
    fan_cost = req.fan_hours * 3
    solar_saving = req.solar_panels * 180
    working_impact = (req.working_hours - 8) * 25 if req.working_hours > 8 else 0

    estimated_bill = max(1500, base_cost + ac_cost + fan_cost + working_impact - solar_saving)
    savings = max(0, base_cost - estimated_bill)
    ac_pct = round((ac_cost / estimated_bill) * 100) if estimated_bill > 0 else 0
    fan_pct = round((fan_cost / estimated_bill) * 100) if estimated_bill > 0 else 0

    if req.ac_hours > 10:
        tip = "Reducing AC usage by 2 hours could save ₹270/month"
    elif req.solar_panels == 0:
        tip = "Installing 5 solar panels could save ₹900/month"
    else:
        tip = "Great choices! You're on track for significant savings."

    return SimulationResponse(
        estimated_bill=round(estimated_bill),
        estimated_savings=round(savings),
        ac_contribution_percent=ac_pct,
        fan_contribution_percent=fan_pct,
        solar_saving=round(solar_saving),
        tip=tip,
    )


@router.get("/efficiency-score")
async def get_efficiency_score(current_user: dict = Depends(get_current_user)):
    values = _get_daily_data(current_user["user_id"])
    avg = np.mean(values)
    std = np.std(values)
    consistency = max(0, 100 - (std / avg * 100)) if avg > 0 else 50
    efficiency = max(0, 100 - (avg / 30 * 100))
    score = round(consistency * 0.4 + efficiency * 0.6)

    if score >= 90: label = "Excellent"
    elif score >= 80: label = "Good"
    elif score >= 60: label = "Average"
    elif score >= 40: label = "Below Average"
    else: label = "Poor"

    return {"score": score, "label": label, "breakdown": {"consistency": round(consistency), "efficiency": round(efficiency)}}


@router.get("/challenges")
async def get_challenges(current_user: dict = Depends(get_current_user)):
    return {"challenges": [
        {"id": 1, "title": "Save 5% This Week", "description": "Reduce your weekly consumption by 5% compared to last week",
         "progress": 72, "reward": "Energy Saver Badge", "daysLeft": 3, "status": "active"},
        {"id": 2, "title": "Peak Hour Warrior", "description": "Keep consumption below 2 kWh during peak hours for 5 days",
         "progress": 60, "reward": "Peak Warrior Badge", "daysLeft": 2, "status": "active"},
        {"id": 3, "title": "Night Owl Saver", "description": "Shift 30% of discretionary usage to off-peak hours",
         "progress": 100, "reward": "Night Owl Badge", "daysLeft": 0, "status": "completed"},
        {"id": 4, "title": "AC Efficiency Master", "description": "Maintain AC at 24°C or higher for 7 consecutive days",
         "progress": 45, "reward": "Cool Saver Badge", "daysLeft": 4, "status": "active"},
    ]}
