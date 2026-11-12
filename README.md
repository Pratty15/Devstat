# DevStat 🚀

A full-stack developer impact analysis tool that evaluates GitHub profiles using real-time data and machine learning.

## What it does

Enter any GitHub username → DevStat fetches all their public repos, analyzes stars, forks, watchers & repo count, and classifies the developer's impact as **LOW**, **MEDIUM**, or **HIGH** with visual charts.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Chart.js |
| Backend | Node.js, Express 5, Axios |
| ML Service | Python, Flask, scikit-learn, Joblib |

## Architecture

```
React Frontend (:5173)  →  Express Backend (:5000)  →  Flask ML API (:5001)
                                    ↓
                            GitHub REST API
```

1. Frontend sends the GitHub username to the backend.
2. Backend fetches all public repos from GitHub API and builds a feature vector.
3. Feature vector is sent to the Flask ML microservice for prediction.
4. Results are normalized using logarithmic scaling and combined with the ML prediction (hybrid scoring).
5. Frontend displays: traffic light indicator, heat bars, and a radar chart.

## Setup & Run

### 1. ML Microservice (Port 5001)
```bash
cd model
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install flask joblib scikit-learn numpy
python model_api.py
```

### 2. Backend Server (Port 5000)
```bash
cd backend
npm install
node server.js
```

### 3. Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

> **Note:** The ML model file (`devstat_model.pkl`) is not included in the repo due to its size (~172MB). You need to train/generate it separately.

## Features

- Real-time GitHub profile analysis (no API key required)
- Hybrid scoring: logarithmic normalization + ML prediction
- Radar chart comparing user stats vs ideal benchmarks
- Color-coded heat bars for Stars, Forks, and Activity
- Traffic light impact indicator (RED / YELLOW / GREEN)
