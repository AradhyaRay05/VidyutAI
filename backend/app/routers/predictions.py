from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
import numpy as np

from app.core.deps import get_current_user
from app.services.db_service import db_service

router = APIRouter(prefix="/api/predict", tags=["predictions"])


def _get_historical(user_id):
    try:
        df = db_service.get_data_as_dataframe(user_id)
        if not df.empty and len(df) >= 7:
            return df
    except Exception:
        pass
    return None


@router.get("/daily")
async def predict_daily(days: int = 7, current_user: dict = Depends(get_current_user)):
    historical_df = _get_historical(current_user["user_id"])

    if historical_df is not None:
        from app.services.ml_service import ml_service
        tariff_rate = float(current_user.get("tariff_rate", 7.00))
        predictions = ml_service.predict_next_days(historical_df, days=days, tariff_rate=tariff_rate)
        predictions_list = predictions.to_dict("records")
        for pred in predictions_list:
            pred["date"] = pred["date"].strftime("%Y-%m-%d")
            pred["predicted_kwh"] = round(float(pred["predicted_kwh"]), 2)
            pred["predicted_cost"] = round(float(pred["predicted_cost"]), 2)
        return {"predictions": predictions_list}

    # Demo mode: generate mock predictions
    base_kwh = 30
    predictions = []
    today = datetime.now()
    for i in range(1, days + 1):
        pred_date = today + timedelta(days=i)
        kwh = base_kwh + np.random.uniform(-5, 8)
        confidence = max(0.75, 0.96 - i * 0.02)
        predictions.append({
            "date": pred_date.strftime("%Y-%m-%d"),
            "predicted_kwh": round(kwh, 2),
            "predicted_cost": round(kwh * 7.0, 2),
            "confidence_score": round(confidence, 2),
        })
    return {"predictions": predictions}


@router.get("/monthly")
async def predict_monthly(current_user: dict = Depends(get_current_user)):
    historical_df = _get_historical(current_user["user_id"])

    if historical_df is not None:
        from app.services.ml_service import ml_service
        tariff_rate = float(current_user.get("tariff_rate", 7.00))
        return ml_service.predict_monthly(historical_df, tariff_rate=tariff_rate)

    # Demo mode
    return {
        "predicted_monthly_kwh": 920.0,
        "predicted_monthly_cost": 6440.0,
    }
