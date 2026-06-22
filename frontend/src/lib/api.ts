const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
}

interface ApiUser {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
}

interface LoginResponse {
  access_token: string;
  user: ApiUser;
}

interface StatusResponse {
  authenticated: boolean;
  user: ApiUser;
}

interface MessageResponse {
  message: string;
}

interface StatsResponse {
  stats: Record<string, number | string | null>;
}

interface InsightsResponse {
  insights: Array<Record<string, string>>;
}

interface DataResponse {
  data: Array<Record<string, unknown>>;
}

interface PredictionsResponse {
  predictions: Array<Record<string, unknown>>;
}

interface AnomaliesResponse {
  anomalies: Array<Record<string, unknown>>;
}

interface RecommendationsResponse {
  recommendations: Array<Record<string, unknown>>;
}

interface SimulationResponse {
  estimated_bill: number;
  estimated_savings: number;
  ac_contribution_percent: number;
  fan_contribution_percent: number;
  solar_saving: number;
  tip: string;
}

interface EfficiencyResponse {
  score: number;
  label: string;
  breakdown: Record<string, number>;
}

interface ChallengesResponse {
  challenges: Array<Record<string, unknown>>;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { username, password },
      }),
    register: (data: { username: string; email: string; password: string; full_name?: string; household_size?: number; tariff_rate?: number }) =>
      apiRequest<MessageResponse>("/api/auth/register", {
        method: "POST",
        body: data as unknown as Record<string, unknown>,
      }),
    status: (token: string) =>
      apiRequest<StatusResponse>("/api/auth/status", { token }),
  },

  dashboard: {
    summary: (token: string, days = 30) =>
      apiRequest<StatsResponse>(`/api/dashboard/summary?days=${days}`, { token }),
    insights: (token: string) =>
      apiRequest<InsightsResponse>("/api/dashboard/insights", { token }),
  },

  data: {
    daily: (token: string, days = 30) =>
      apiRequest<DataResponse>(`/api/data/daily?days=${days}`, { token }),
    appliances: (token: string) =>
      apiRequest<DataResponse>("/api/data/appliances", { token }),
    monthly: (token: string, months = 12) =>
      apiRequest<DataResponse>(`/api/data/monthly?months=${months}`, { token }),
    add: (token: string, record: { appliance_name: string; power_usage_kwh: number; duration_hours?: number; timestamp?: string }) =>
      apiRequest<MessageResponse>("/api/data/add", { method: "POST", body: record as unknown as Record<string, unknown>, token }),
  },

  predict: {
    daily: (token: string, days = 7) =>
      apiRequest<PredictionsResponse>(`/api/predict/daily?days=${days}`, { token }),
    monthly: (token: string) =>
      apiRequest<Record<string, unknown>>("/api/predict/monthly", { token }),
  },

  ai: {
    anomalies: (token: string) =>
      apiRequest<AnomaliesResponse>("/api/ai/anomalies", { token }),
    recommendations: (token: string) =>
      apiRequest<RecommendationsResponse>("/api/ai/recommendations", { token }),
    simulate: (token: string, params: { ac_hours: number; fan_hours: number; solar_panels: number; working_hours: number }) =>
      apiRequest<SimulationResponse>("/api/ai/simulate", { method: "POST", body: params as unknown as Record<string, unknown>, token }),
    efficiencyScore: (token: string) =>
      apiRequest<EfficiencyResponse>("/api/ai/efficiency-score", { token }),
    challenges: (token: string) =>
      apiRequest<ChallengesResponse>("/api/ai/challenges", { token }),
  },
};
