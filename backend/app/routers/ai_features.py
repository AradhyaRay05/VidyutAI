import numpy as np
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.services.db_service import db_service
from app.models.schemas import SimulationRequest, SimulationResponse

router = APIRouter(prefix="/api/ai", tags=["ai-features"])


def _get_user_data(user_id):
    daily = []
    appliances = []
    try:
        daily = db_service.get_daily_consumption(user_id, days=30) or []
    except Exception:
        pass
    try:
        appliances = db_service.get_appliance_consumption(user_id) or []
    except Exception:
        pass
    return daily, appliances


def _has_data(daily):
    return daily is not None and len(daily) >= 3


@router.get("/anomalies")
async def detect_anomalies(current_user: dict = Depends(get_current_user)):
    daily, _ = _get_user_data(current_user["user_id"])

    if not _has_data(daily):
        return {"anomalies": [], "message": "Upload at least 3 days of data to detect anomalies"}

    values = [float(d["total_kwh"]) for d in daily]
    dates = [d["date"].strftime("%Y-%m-%d") if hasattr(d["date"], "strftime") else str(d["date"]) for d in daily]
    mean_val = np.mean(values)
    std_val = np.std(values)
    threshold_high = mean_val + 2 * std_val if std_val > 0 else mean_val * 1.5

    anomalies = []
    for i, (val, date_str) in enumerate(zip(values, dates)):
        if val > threshold_high:
            deviation = abs((val - mean_val) / mean_val) * 100 if mean_val > 0 else 0
            severity = "high" if deviation > 40 else "medium"
            anomalies.append({
                "date": date_str, "type": "spike",
                "value": round(val, 2), "expected": round(mean_val, 2),
                "deviation": round(deviation, 1),
                "description": f"Consumption of {val:.1f} kWh is {deviation:.0f}% above your average of {mean_val:.1f} kWh. Check for appliances left running or unusual usage.",
                "severity": severity,
            })
        elif std_val > 0 and val < mean_val - 2 * std_val:
            deviation = abs((val - mean_val) / mean_val) * 100 if mean_val > 0 else 0
            anomalies.append({
                "date": date_str, "type": "drop",
                "value": round(val, 2), "expected": round(mean_val, 2),
                "deviation": round(deviation, 1),
                "description": f"Unusually low consumption of {val:.1f} kWh detected. This may indicate a power outage or disconnected appliances.",
                "severity": "low",
            })
    return {"anomalies": anomalies}


@router.get("/recommendations")
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    tariff = float(current_user.get("tariff_rate", 7.0))
    daily, appliances = _get_user_data(user_id)

    if not _has_data(daily):
        return {"recommendations": [
            {"id": 1, "title": "Upload your energy data", "description": "Upload your electricity bills or connect your smart meter to get personalized AI recommendations.",
             "savings": 0, "priority": "high", "category": "setup"},
        ]}

    values = [float(d["total_kwh"]) for d in daily]
    costs = [float(d["total_cost"]) for d in daily]
    avg_daily = np.mean(values)
    avg_cost = np.mean(costs)
    monthly_cost = avg_cost * 30

    recommendations = []
    rec_id = 1

    # Find top consumer
    if appliances:
        top = appliances[0]
        top_name = top["appliance_name"]
        top_kwh = float(top["total_kwh"])
        top_cost = float(top["total_cost"])
        recommendations.append({
            "id": rec_id, "title": f"Optimize {top_name}",
            "description": f"{top_name} is your highest consumer at {top_kwh:.1f} kWh (₹{top_cost:.0f}). Consider upgrading to an energy-efficient model or reducing usage.",
            "savings": round(top_cost * 0.25), "priority": "high", "category": "appliances",
        })
        rec_id += 1

    # AC recommendation
    ac_data = next((a for a in appliances if "air conditioner" in a["appliance_name"].lower() or "ac" in a["appliance_name"].lower()), None)
    if ac_data:
        ac_cost = float(ac_data["total_cost"])
        recommendations.append({
            "id": rec_id, "title": "Shift AC to off-peak hours",
            "description": f"Your AC costs ₹{ac_cost:.0f}/month. Running it after 8 PM can reduce costs by 30% due to lower time-of-use rates.",
            "savings": round(ac_cost * 0.30), "priority": "high", "category": "cooling",
        })
        rec_id += 1

    # Standby power
    standby_savings = round(monthly_cost * 0.08)
    if standby_savings > 50:
        recommendations.append({
            "id": rec_id, "title": "Eliminate standby power drain",
            "description": f"Standby power accounts for ~8% of your ₹{monthly_cost:.0f} monthly bill. Smart power strips can eliminate phantom loads automatically.",
            "savings": standby_savings, "priority": "medium", "category": "appliances",
        })
        rec_id += 1

    # Efficiency trend
    if len(values) >= 14:
        first_half = np.mean(values[len(values)//2:])
        second_half = np.mean(values[:len(values)//2])
        if second_half > first_half * 1.1:
            increase_pct = ((second_half / first_half) - 1) * 100
            recommendations.append({
                "id": rec_id, "title": "Your usage is trending upward",
                "description": f"Your recent consumption is {increase_pct:.0f}% higher than earlier data. Review what changed — new appliances, seasonal habits, or equipment issues.",
                "savings": round((second_half - first_half) * tariff * 30), "priority": "high", "category": "behavior",
            })
            rec_id += 1

    # Peak usage
    peak_val = max(values)
    peak_idx = values.index(peak_val)
    recommendations.append({
        "id": rec_id, "title": "Reduce peak day consumption",
        "description": f"Your peak consumption was {peak_val:.1f} kWh. Identifying what caused this spike can help you plan better and avoid high bills.",
        "savings": round((peak_val - avg_daily) * tariff), "priority": "medium", "category": "optimization",
    })
    rec_id += 1

    # Generic tips
    recommendations.append({
        "id": rec_id, "title": "Switch to LED lighting",
        "description": "If you still use CFL or incandescent bulbs, switching to LED can reduce lighting costs by 60%.",
        "savings": round(avg_daily * 0.13 * tariff * 30), "priority": "medium", "category": "lighting",
    })

    return {"recommendations": recommendations}


@router.post("/simulate")
async def simulate_scenario(req: SimulationRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    base_cost = 4850
    try:
        daily_data = db_service.get_daily_consumption(user_id, days=30)
        if daily_data and len(daily_data) > 0:
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
        tip = f"Reducing AC usage by 2 hours could save ₹{round(req.ac_hours * 2 * 45 * 0.3)}/month"
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
    user_id = current_user["user_id"]
    daily, appliances = _get_user_data(user_id)

    if not _has_data(daily):
        return {"score": 50, "label": "Insufficient Data", "breakdown": {"consistency": 50, "efficiency": 50},
                "message": "Upload at least 7 days of data for an accurate score"}

    values = [float(d["total_kwh"]) for d in daily]
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

    return {"score": score, "label": label,
            "breakdown": {"consistency": round(consistency), "efficiency": round(efficiency)}}


@router.get("/challenges")
async def get_challenges(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    daily, appliances = _get_user_data(user_id)
    tariff = float(current_user.get("tariff_rate", 7.0))

    if not _has_data(daily):
        return {"challenges": [
            {"id": 1, "title": "Upload your first dataset", "description": "Upload your electricity data to unlock personalized energy challenges.",
             "progress": 0, "reward": "Data Pioneer Badge", "daysLeft": 7, "status": "active"},
        ]}

    values = [float(d["total_kwh"]) for d in daily]
    costs = [float(d["total_cost"]) for d in daily]
    avg_daily = np.mean(values)
    avg_cost = np.mean(costs)
    recent_7 = values[:min(7, len(values))]
    prev_7 = values[7:min(14, len(values))] if len(values) > 7 else values

    recent_avg = np.mean(recent_7)
    prev_avg = np.mean(prev_7) if prev_7 else recent_avg

    weekly_change = ((recent_avg / prev_avg) - 1) * 100 if prev_avg > 0 else 0
    peak_val = max(values)
    peak_target = round(avg_daily * 0.9, 1)

    challenges = []
    ch_id = 1

    # Challenge 1: Reduce from current
    save_target = max(3, round(abs(weekly_change) + 2))
    save_progress = max(0, min(100, round((1 - (recent_avg - avg_daily * (1 - save_target/100)) / recent_avg) * 100))) if recent_avg > avg_daily else 85
    challenges.append({
        "id": ch_id, "title": f"Save {save_target}% This Week",
        "description": f"Your recent average is {recent_avg:.1f} kWh/day. Target: {avg_daily * (1 - save_target/100):.1f} kWh/day",
        "progress": max(0, min(100, save_progress)), "reward": "Energy Saver Badge", "daysLeft": 4, "status": "active",
    })
    ch_id += 1

    # Challenge 2: Peak usage reduction
    peak_progress = max(0, min(100, round((1 - (peak_val - peak_target) / peak_val) * 100)))
    challenges.append({
        "id": ch_id, "title": "Beat Your Peak Day",
        "description": f"Your peak was {peak_val:.1f} kWh. Target: keep daily usage below {peak_target} kWh for 5 days.",
        "progress": peak_progress, "reward": "Peak Crusher Badge", "daysLeft": 5, "status": "active",
    })
    ch_id += 1

    # Challenge 3: Cost target
    monthly_target = round(avg_cost * 30 * 0.9)
    challenges.append({
        "id": ch_id, "title": f"Monthly Bill Under ₹{monthly_target}",
        "description": f"Your current monthly bill is ~₹{round(avg_cost * 30)}. Target: ₹{monthly_target} by optimizing usage.",
        "progress": max(0, min(100, round((1 - (avg_cost * 30 - monthly_target) / (avg_cost * 30)) * 100))) if avg_cost > 0 else 0,
        "reward": "Budget Master Badge", "daysLeft": 15, "status": "active",
    })
    ch_id += 1

    # Challenge 4: Top appliance optimization
    if appliances:
        top = appliances[0]
        top_name = top["appliance_name"]
        top_kwh = float(top["total_kwh"])
        reduce_target = round(top_kwh * 0.15, 1)
        challenges.append({
            "id": ch_id, "title": f"Reduce {top_name} by 15%",
            "description": f"{top_name} uses {top_kwh:.1f} kWh. Reduce by {reduce_target:.1f} kWh through efficiency improvements.",
            "progress": 30, "reward": "Efficiency Expert Badge", "daysLeft": 7, "status": "active",
        })
        ch_id += 1

    # Challenge 5: Consistency
    std_val = np.std(values)
    consistency_pct = round((1 - std_val / avg_daily) * 100) if avg_daily > 0 else 50
    challenges.append({
        "id": ch_id, "title": "Consistent Usage Week",
        "description": f"Keep your daily usage consistent (low variation). Current consistency: {consistency_pct}%.",
        "progress": max(0, min(100, consistency_pct)), "reward": "Steady Saver Badge", "daysLeft": 7, "status": "active",
    })

    return {"challenges": challenges}
