import sqlite3
from typing import Generator
from backend.app.database.session import get_db_dependency

def get_db() -> Generator[sqlite3.Connection, None, None]:
    return get_db_dependency()
