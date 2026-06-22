import csv
import io
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse

from app.core.deps import get_current_user
from app.services.db_service import db_service
from app.models.schemas import AddRecordRequest

router = APIRouter(prefix="/api/data", tags=["data"])

MOCK_DAILY = [
    {"date": f"2025-06-{i:02d}", "total_kwh": round(25 + (i % 5) * 2.5, 2), "total_cost": round(175 + (i % 5) * 17.5, 2), "appliances_used": 4 + (i % 3), "total_records": 8 + (i % 5)}
    for i in range(1, 22)
]

MOCK_APPLIANCES = [
    {"appliance_name": "Air Conditioner", "total_kwh": 128.5, "total_cost": 1798.0, "usage_count": 45, "avg_kwh_per_use": 2.86},
    {"appliance_name": "Refrigerator", "total_kwh": 54.2, "total_cost": 759.0, "usage_count": 30, "avg_kwh_per_use": 1.81},
    {"appliance_name": "Lighting", "total_kwh": 42.8, "total_cost": 599.0, "usage_count": 60, "avg_kwh_per_use": 0.71},
    {"appliance_name": "Washing Machine", "total_kwh": 28.4, "total_cost": 398.0, "usage_count": 12, "avg_kwh_per_use": 2.37},
    {"appliance_name": "Television", "total_kwh": 21.6, "total_cost": 302.0, "usage_count": 20, "avg_kwh_per_use": 1.08},
    {"appliance_name": "Computer", "total_kwh": 18.9, "total_cost": 265.0, "usage_count": 25, "avg_kwh_per_use": 0.76},
    {"appliance_name": "Fan", "total_kwh": 15.2, "total_cost": 213.0, "usage_count": 40, "avg_kwh_per_use": 0.38},
]

MOCK_MONTHLY = [
    {"year": 2025, "month": m, "total_kwh": round(750 + m * 80, 2), "total_cost": round(5250 + m * 560, 2), "avg_daily_kwh": round(25 + m * 2.7, 2), "peak_kwh": round(35 + m * 1.5, 2)}
    for m in range(1, 7)
]


@router.get("/daily")
async def get_daily_data(days: int = 30, current_user: dict = Depends(get_current_user)):
    try:
        data = db_service.get_daily_consumption(current_user["user_id"], days=days)
        if data:
            for r in data:
                if isinstance(r["date"], datetime):
                    r["date"] = r["date"].strftime("%Y-%m-%d")
                for k in ("total_kwh", "total_cost"):
                    if k in r:
                        r[k] = float(r[k])
            return {"data": data}
    except Exception:
        pass
    return {"data": MOCK_DAILY[:days]}


@router.get("/appliances")
async def get_appliance_data(current_user: dict = Depends(get_current_user)):
    try:
        data = db_service.get_appliance_consumption(current_user["user_id"])
        if data:
            for r in data:
                for k in ("total_kwh", "total_cost", "avg_kwh_per_use"):
                    if k in r:
                        r[k] = float(r[k])
            return {"data": data}
    except Exception:
        pass
    return {"data": MOCK_APPLIANCES}


@router.get("/monthly")
async def get_monthly_data(months: int = 12, current_user: dict = Depends(get_current_user)):
    try:
        data = db_service.get_monthly_statistics(current_user["user_id"], months=months)
        if data:
            for r in data:
                for k in ("total_kwh", "total_cost", "avg_daily_kwh", "peak_kwh"):
                    if k in r:
                        r[k] = float(r[k])
            return {"data": data}
    except Exception:
        pass
    return {"data": MOCK_MONTHLY[:months]}


@router.post("/add", status_code=201)
async def add_energy_record(req: AddRecordRequest, current_user: dict = Depends(get_current_user)):
    tariff_rate = float(current_user.get("tariff_rate", 7.0))
    timestamp = req.timestamp or datetime.now().isoformat()
    cost = req.power_usage_kwh * tariff_rate

    try:
        success = db_service.add_energy_record(
            current_user["user_id"], timestamp, req.appliance_name, req.power_usage_kwh, cost, req.duration_hours,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not success:
        raise HTTPException(status_code=500, detail="Failed to insert record into database")
    return {"message": "Record added successfully"}


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        text = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)

    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    tariff = float(current_user.get("tariff_rate", 7.0))
    records = []
    skipped = 0

    for row in rows:
        try:
            appliance = row.get("appliance_name") or row.get("appliance") or row.get("Appliance") or "Unknown"
            kwh = float(row.get("power_usage_kwh") or row.get("kwh") or row.get("consumption") or row.get("kWh") or 0)
            if kwh <= 0:
                skipped += 1
                continue

            timestamp = row.get("timestamp") or row.get("date") or row.get("Date") or datetime.now().isoformat()
            duration = float(row.get("duration_hours") or row.get("hours") or row.get("duration") or 1.0)
            cost = kwh * tariff

            records.append({
                "timestamp": timestamp,
                "appliance_name": appliance,
                "power_usage_kwh": kwh,
                "cost": cost,
                "duration_hours": duration,
            })
        except (ValueError, TypeError):
            skipped += 1
            continue

    if not records:
        raise HTTPException(status_code=400, detail="No valid records found. CSV needs columns: appliance_name, power_usage_kwh (or kwh)")

    success = db_service.bulk_insert(current_user["user_id"], records)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save records")

    return {
        "message": f"Successfully imported {len(records)} records",
        "imported": len(records),
        "skipped": skipped,
        "filename": file.filename,
    }


@router.get("/sample-csv")
async def get_sample_csv():
    sample = """appliance_name,power_usage_kwh,timestamp,duration_hours
Air Conditioner,3.5,2025-06-01 14:00:00,4.0
Refrigerator,1.8,2025-06-01 00:00:00,24.0
Lighting,0.5,2025-06-01 18:00:00,6.0
Television,0.3,2025-06-01 20:00:00,3.0
Washing Machine,2.0,2025-06-02 10:00:00,1.5
Computer,0.4,2025-06-02 09:00:00,8.0
Fan,0.2,2025-06-02 22:00:00,8.0
"""
    return JSONResponse(content={"csv": sample, "filename": "sample_energy_data.csv"})
