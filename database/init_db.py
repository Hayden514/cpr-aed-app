import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "aed_locations.db"


def init_db():
    connection = sqlite3.connect(DATABASE_PATH)

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS aeds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                address TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                notes TEXT
            )
        """)
        connection.commit()
        print(f"Database initialized: {DATABASE_PATH}")
    finally:
        connection.close()


if __name__ == "__main__":
    init_db()
