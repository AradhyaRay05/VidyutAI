# VidyutAI Redesign - Implementation Plan

## Current State
- **Frontend**: Flask Jinja2 templates + vanilla CSS/JS
- **Backend**: Flask (Python)
- **Database**: MySQL
- **ML**: scikit-learn RandomForestRegressor
- **Charts**: Matplotlib/Seaborn (server-side rendered as base64 images)

## Target State
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Recharts
- **Backend**: FastAPI (Python)
- **Database**: MySQL (keep existing, add Prisma for ORM)
- **ML**: Scikit-Learn + XGBoost (enhanced)
- **Charts**: Recharts (client-side interactive)

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Initialize Next.js 15 Frontend
- Create `frontend-next/` directory with Next.js 15 App Router
- Configure TypeScript, Tailwind CSS, Shadcn UI
- Set up Framer Motion, Recharts, next-themes
- Configure path aliases (@/)

### 1.2 Set Up Design System
- Implement color tokens (primary #7B39FC, secondary #2B2344, etc.)
- Configure fonts: Manrope, Instrument Serif, Inter, Cabin
- Dark/Light mode with next-themes + animated transitions
- Create base component library

### 1.3 Backend Migration Prep
- Create FastAPI app structure alongside existing Flask app
- Set up SQLAlchemy models matching existing MySQL schema
- Create Pydantic schemas for API validation

---

## Phase 2: Landing Page

### 2.1 Hero Section
- Full-screen animated background (CSS gradient animation + particle effect)
- Large serif headline with fade-up animation
- Dynamic toggle (Day/Night/Summer/Winter/Office/Home)
- Live savings card with animated number counting
- Primary + Secondary CTAs

### 2.2 Features Section
- 6 feature cards with icons and hover effects
- Framer Motion stagger animations

### 2.3 How It Works
- 4-step process with connected timeline
- Scroll-triggered animations

### 2.4 Stats Section
- Animated counters (15% savings, 24/7 monitoring, etc.)

### 2.5 Footer
- Links, social icons, branding

---

## Phase 3: Authentication

### 3.1 Auth Pages
- Login page with email/password
- Register page with full form
- Google OAuth + GitHub OAuth buttons (UI only for now)
- Animated transitions between login/register

### 3.2 Auth System
- JWT-based authentication (replacing Flask sessions)
- Auth context provider
- Protected route middleware
- Token refresh logic

---

## Phase 4: Dashboard Core

### 4.1 Dashboard Layout
- Responsive sidebar with navigation
- Top bar with user profile, theme toggle, notifications
- Three-column responsive grid layout
- Mobile-first responsive design

### 4.2 Energy Overview Cards
- Current Usage (kWh) with trend indicator
- Predicted Usage (kWh) with confidence
- Estimated Bill (₹) with comparison
- Potential Savings (₹) with recommendation count
- Carbon Reduction (%) with visual indicator
- Animated number counting on load

### 4.3 Interactive Charts (Recharts)
- Electricity Consumption Graph (line + area)
  - Zoom, hover insights, filtering
  - Time range: Daily/Weekly/Monthly/Yearly
- Consumption Heatmap (hours vs usage)
- AI Trend Forecast with confidence intervals

---

## Phase 5: AI Features

### 5.1 Appliance-Level Consumption
- Interactive donut chart
- Appliance breakdown with percentages
- Hover details with cost/kWh

### 5.2 AI Bill Breakdown
- Stacked bar chart: Cooling/Lighting/Appliances/Other

### 5.3 AI Cost Simulator
- Interactive sliders for AC, Fan, Solar, Working hours
- Real-time recalculation of expected bill and savings

### 5.4 What-If Simulation Engine
- Predefined scenarios + custom inputs
- Visual comparison charts

### 5.5 Energy Efficiency Score
- Circular progress indicator (83/100)
- Color-coded rating system
- Breakdown by category

### 5.6 AI Recommendations Engine
- Card-based recommendations
- Priority sorting (high/medium/low)
- Savings estimates per recommendation

---

## Phase 6: Advanced Features

### 6.1 Anomaly Detection
- Timeline markers on graphs
- Alert cards for spikes/drops
- Investigation suggestions

### 6.2 Energy Insights Page
- Natural language AI summaries
- Trend analysis cards
- Actionable recommendations

### 6.3 Smart Report Generation
- PDF report builder
- Charts + analysis + recommendations
- Downloadable format

### 6.4 AI Chat Assistant
- Chat interface with message history
- Context-aware responses using user data
- Quick action suggestions

### 6.5 Gamification
- Energy challenges with progress bars
- Badge system
- Achievement streaks

---

## Phase 7: Backend API Enhancement

### 7.1 FastAPI Endpoints
- All existing Flask endpoints migrated
- New endpoints for AI features
- WebSocket support for real-time updates

### 7.2 Enhanced ML Pipeline
- XGBoost model integration
- Anomaly detection algorithm
- Appliance-level estimation model
- What-if simulation engine

---

## Phase 8: Polish & Optimization

### 8.1 Animations (Framer Motion)
- Page transitions
- Card hover effects
- Number counting animations
- Graph transitions
- Floating elements

### 8.2 Performance
- Image optimization
- Code splitting
- Lazy loading
- API response caching

### 8.3 Responsive Design
- Mobile-first breakpoints
- Tablet optimization
- Desktop dashboard
- No horizontal scrolling

---

## Implementation Order

1. **Phase 1**: Project setup (Next.js + Tailwind + Shadcn) ← START HERE
2. **Phase 2**: Landing page with animations
3. **Phase 3**: Auth system
4. **Phase 4**: Dashboard layout + overview cards + main charts
5. **Phase 5**: AI features (simulator, recommendations, efficiency score)
6. **Phase 6**: Advanced features (anomaly detection, insights, chat)
7. **Phase 7**: FastAPI backend enhancement
8. **Phase 8**: Polish, animations, responsive fixes
