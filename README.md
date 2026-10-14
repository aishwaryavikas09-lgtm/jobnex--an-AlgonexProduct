# JOBNEX — An Algonex Product

> **JobNex** is an intelligent Resume Analyzer that matches candidate resumes with job descriptions, evaluates skill alignments, identifies skill gaps, calculates match scores, and provides actionable recommendations.

---

## ⚡ Features

- **Skill Matching**: Compares resume content against job specifications to identify matching proficiencies.
- **Skill Gap Detection**: Highlights missing technologies and competencies required for the role.
- **Match Score Calculation**: Generates an instant percentage score reflecting job alignment.
- **Personalized Recommendations**: Offers actionable tips to help candidates tailor their profiles.
- **History & Persistence**: Stores analysis records in MySQL database with timestamp and score tracking.
- **Modern Responsive UI**: Clean dark-mode interface with score gauge animations and real-time character counters.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 & CSS3**: Modern responsive UI with CSS variables, glassmorphism accents, and animated score gauges.
- **JavaScript (ES6+)**: Asynchronous API calls, DOM manipulation, and dynamic result rendering.

### Backend
- **FastAPI**: High-performance Python web framework for RESTful APIs.
- **SQLAlchemy & MySQL Connector**: Relational database ORM and connection handling.
- **Pydantic**: Request/response data validation.
- **Uvicorn**: ASGI web server implementation.

---

## 📁 Project Structure

```
JOBNEX/
├── BACKEND/
│   ├── MAIN.PY              # FastAPI application & API routes
│   ├── analizer.py          # Resume analysis & skill matching logic
│   ├── analize_test.py      # Extended analyzer utilities
│   ├── database.py          # Database configuration & models
│   └── just_analize.py      # Standalone analysis scripts
├── FRONTEND/                # Frontend assets & modules
├── INDEX.HTML               # Main Web Application UI
├── SCRIPT.JS                # Frontend application logic & API integration
├── STYLE.CSS                # Design system, styling & animations
├── .gitignore               # Git ignore rules for environments & artifacts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **MySQL Server 8.0+**
- Modern Web Browser (Chrome, Firefox, Edge)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql mysql-connector-python pydantic
   ```

4. Configure your MySQL credentials in `BACKEND/database.py`:
   ```python
   DB_USER     = "root"
   DB_PASSWORD = "your_mysql_password"
   DB_HOST     = "127.0.0.1"
   DB_PORT     = "3306"
   DB_NAME     = "jobnex_db"
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn MAIN:app --reload --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup

1. Open `INDEX.HTML` directly in a browser or serve it using a local static server:
   ```bash
   # Using Python:
   python -m http.server 5500
   ```
   Or use VS Code's **Live Server** extension at `http://127.0.0.1:5500`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check endpoint |
| `POST` | `/api/analyse` | Analyzes resume vs. job description & saves results |
| `GET` | `/api/analyses` | Retrieves recent analysis history |

---

## 📄 License

Developed as part of the **Algonex** product suite. All rights reserved.
