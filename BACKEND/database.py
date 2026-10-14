from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from urllib.parse import quote_plus

import os

# -------------------------------------------------------
# MySQL Connection Config
# Override with environment variables or adjust defaults
# -------------------------------------------------------
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Algonex@123")
DB_HOST     = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT     = os.getenv("DB_PORT", "3306")
DB_NAME     = os.getenv("DB_NAME", "jobnex_db")
# -------------------------------------------------------

# quote_plus encodes special characters like @ in the password safely
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ----- Database Models -----

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id               = Column(Integer, primary_key=True, index=True)
    resume           = Column(Text,    nullable=False)
    job_description  = Column(Text,    nullable=False)
    matched_skills   = Column(String(500))
    unmatched_skills = Column(String(500))
    suggestions      = Column(Text)
    created_at       = Column(DateTime, default=datetime.utcnow)


def create_tables():
    """Create all tables in the database (runs on startup)."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency to get a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_connection():
    """Return a raw MySQL connection using mysql.connector."""
    import mysql.connector
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=int(DB_PORT),
        database=DB_NAME
    )

