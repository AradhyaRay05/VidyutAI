import sys
import os

_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

_predictor = None


class MLPredictorService:
    def __init__(self):
        self._predictor = None
        self._loaded = False

    def _get_predictor(self):
        if self._predictor is None:
            from ml_models.energy_predictor import EnergyPredictor
            from app.core.config import settings
            self._predictor = EnergyPredictor(model_path=settings.MODEL_PATH)
        return self._predictor

    def predict_next_days(self, historical_df, days: int = 7, tariff_rate: float = 7.00):
        predictor = self._get_predictor()
        if not self._loaded:
            try:
                predictor.load_model()
                self._loaded = True
            except Exception:
                if historical_df is not None and not historical_df.empty:
                    predictor.train(historical_df)
                    predictor.save_model()
                    self._loaded = True
        return predictor.predict_next_days(historical_df, days=days, tariff_rate=tariff_rate)

    def predict_monthly(self, historical_df, tariff_rate: float = 7.00):
        predictor = self._get_predictor()
        if not self._loaded:
            try:
                predictor.load_model()
                self._loaded = True
            except Exception:
                if historical_df is not None and not historical_df.empty:
                    predictor.train(historical_df)
                    predictor.save_model()
                    self._loaded = True
        return predictor.predict_monthly(historical_df, tariff_rate=tariff_rate)


def _get_ml_service():
    global _predictor
    if _predictor is None:
        _predictor = MLPredictorService()
    return _predictor


ml_service = _get_ml_service()
