import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "aed_locations.db"

with sqlite3.connect(DATABASE_PATH) as connection:
    connection.execute(
        """
        INSERT INTO aeds (name, address, latitude, longitude, notes)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            "TEST AED - Not a real device",
            "Example address for development testing",
            None,
            None,
            "Test record only. Not a verified AED location.",
        ),
    )

print("Test AED record added successfully.")
