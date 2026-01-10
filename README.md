# ⚡ VidyutAI - Energy Consumption Tracker

> AI-powered energy consumption tracker for Indian households — monitor, analyze, and predict your electricity usage with machine learning.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)
![XGBoost](https://img.shields.io/badge/ML-XGBoost-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🎯 Problem Statement

Households lack visibility into their energy consumption patterns, leading to:
- Inefficient electricity usage and high bills
- Inability to identify energy-hungry appliances
- No predictive insights for future consumption
- Missed opportunities to reduce carbon footprint

**Solution:** A data-driven web application that monitors, analyzes, and predicts energy consumption with actionable insights.

---

## ✨ Features

### 📊 Dashboard & Visualization
- Real-time statistics (total consumption, cost, carbon footprint)
- Daily/Weekly/Monthly consumption trends
- Appliance-wise energy breakdown
- Hourly usage patterns & peak identification

### 🔮 ML-Powered Predictions
- 7-30 day consumption forecasts using **XGBoost**
- Monthly bill estimation with confidence scores
- Pattern recognition for usage optimization

### 💡 Smart Insights
- Personalized energy-saving recommendations
- Peak usage alerts
- Cost-saving suggestions
- Carbon footprint tracking (India's grid: 0.82 kg CO₂/kWh)

### 🔐 User Management
- Secure authentication with bcrypt
- User profiles with customizable tariff rates
- Appliance-level tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Flask 2.3.3, Gunicorn |
| **Database** | MySQL 8.0+ |
| **ML** | XGBoost, scikit-learn, pandas, numpy |
| **Visualization** | Matplotlib, Seaborn |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Auth** | bcrypt |[Unit]
Description=VidyutAI Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/VidyutAI
Environment="PATH=/home/ubuntu/VidyutAI/venv/bin"
ExecStart=/home/ubuntu/VidyutAI/venv/bin/gunicorn --workers 2 --bind 0.0.0.0:5000 backend.app:app
Restart=always

[Install]
WantedBy=multi-user.target

---

## 🚀 Installation

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AradhyaRay05/VidyutAI.git
   cd VidyutAI
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   SOURCE database/schema.sql;
   ```

5. **Set environment variables**
   
   Copy `.env.example` to `.env` and update:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=energy_tracker
   DB_USER=root
   DB_PASSWORD=your_password
   SECRET_KEY=your-secret-key
   ```

6. **Run the application**
   ```bash
   python backend/app.py
   ```
   
   Visit: **http://localhost:5000**

---

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/status` | Check auth status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary?days=30` | Summary statistics |
| GET | `/api/dashboard/insights` | AI-generated insights |

### Data Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data/daily?days=30` | Daily consumption |
| GET | `/api/data/appliances` | Appliance list |
| POST | `/api/data/add` | Add energy record |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predict/daily?days=30` | Daily forecast |
| GET | `/api/predict/monthly` | Monthly estimate |

### Visualizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/visualize/energy-consumption` | Consumption chart |
| GET | `/api/visualize/cost-analysis` | Cost breakdown |
| GET | `/api/visualize/hourly-pattern` | Hourly patterns |
| GET | `/api/visualize/appliance-bar` | Appliance comparison |
| GET | `/api/visualize/appliance-pie` | Usage distribution |

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts and preferences |
| `energy_data` | Consumption records |
| `predictions` | ML-generated forecasts |
| `appliances` | Appliance catalog |
| `insights` | Generated recommendations |

---

## 🔮 Future Enhancements

- [ ] IoT sensor integration
- [ ] Mobile app
- [ ] Email/SMS notifications
- [ ] LSTM model for improved predictions
- [ ] PDF report generation

---

## 👨‍💻 Author

**Aradhya Ray**
- GitHub: [@AradhyaRay05](https://github.com/AradhyaRay05)
- Repository: [VidyutAI](https://github.com/AradhyaRay05/VidyutAI)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

**⭐ If this project helps you, please give it a star!**
