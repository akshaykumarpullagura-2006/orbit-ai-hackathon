from sqlite3 import connect
import sqlite3
import os
from typing import Generator
from backend.app.config.settings import settings
from backend.app.core.logging import logger

DB_FILE = "./orbit_ai.db"

def get_sqlite_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    logger.info("Initializing SQLite Database...")
    conn = get_sqlite_conn()
    cursor = conn.cursor()

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
        validation_status TEXT DEFAULT 'PASSED_STANDARDIZED',
        validation_score INTEGER DEFAULT 98,
        validation_checks TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS missions (
        mission_id TEXT PRIMARY KEY,
        original_filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Uploaded',
        upload_time TEXT NOT NULL,
        storage_path TEXT NOT NULL,
        current_stage TEXT NOT NULL DEFAULT 'Planner Agent queued.',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()
    logger.info("SQLite Database initialized successfully.")

def get_db_dependency() -> Generator[sqlite3.Connection, None, None]:
    conn = get_sqlite_conn()
    try:
        yield conn
    finally:
        conn.close()
