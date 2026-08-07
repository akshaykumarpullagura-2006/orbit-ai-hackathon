import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "orbit_ai.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Workflows Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workflows (
        id TEXT PRIMARY KEY,
        task TEXT NOT NULL,
        source TEXT NOT NULL,
        workflow TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        priority TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Results (Business Deliverables) Table with Validation Engine metadata
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        incident_type TEXT NOT NULL,
        priority TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        business_impact TEXT NOT NULL,
        summary TEXT NOT NULL,
        suggested_actions TEXT NOT NULL,
        generated_reply TEXT NOT NULL,
        validation_status TEXT DEFAULT 'PASSED',
        validation_score INTEGER DEFAULT 98,
        validation_checks TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Activity Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        agent TEXT NOT NULL,
        action TEXT NOT NULL,
        target TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()
