from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, dashboard, data, predictions, ai_features, reports

app = FastAPI(title=settings.APP_NAME, description="AI Energy Intelligence Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(data.router)
app.include_router(predictions.router)
app.include_router(ai_features.router)
app.include_router(reports.router)


@app.get("/")
async def root():
    return {"message": "VidyutAI API v2.0", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
