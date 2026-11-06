# CPR and AED Emergency Response Web Application

CSCI 480 Capstone I project.

## Project Goal

Build a web application that helps users locate AED devices and access CPR guidance during an emergency.

## Current Implementation

- Flask backend serving the web interface and AED API.
- SQLite database for storing AED location records.
- Leaflet and OpenStreetMap for an interactive map.
- AED records displayed in a list, with map markers for records containing valid coordinates.
- Empty-database handling so the application does not display fabricated AED locations.

## Technology Stack

- Python
- Flask
- SQLite
- HTML, CSS, and JavaScript
- Leaflet
- OpenStreetMap

## Setup

1. Create and activate a Python virtual environment, if needed.
2. Install Flask:

   ```bash
   python -m pip install Flask
   ```

3. Initialize the database:

   ```bash
   python database/init_db.py
   ```

4. Start the application:

   ```bash
   python app.py
   ```

5. Open `http://127.0.0.1:5000` in a browser.

## Current Limitations

- No verified AED location dataset has been added yet.
- CPR guidance content is not implemented yet.
- Internet access is required to load the external map library and map tiles.

## Planned Next Steps

- Add verified AED location data from an appropriate source.
- Test AED markers and location details.
- Implement clear, step-by-step CPR guidance.
- Add tests and improve documentation.

**Safety note:** This prototype is for development and demonstration. It is not a substitute for emergency services or certified CPR training. In an emergency, call 911 and follow the dispatcher's instructions.

   ```bash
   cd ~/cpr-aed-app
source .venv/bin/activate

python - <<'PY'
import sqlite3
from pathlib import Path

db = Path("database/aed_locations.db")

with sqlite3.connect(db) as connection:
    cursor = connection.execute(
        """
        UPDATE aeds
        SET latitude = ?, longitude = ?
        WHERE id = ?
        AND name = ?
        """,
        (35.5951, -82.5515, 2, "TEST AED - Not a real device"),
    )

    print("Updated records:", cursor.rowcount)

    row = connection.execute(
        """
        SELECT id, name, latitude, longitude
        FROM aeds
        WHERE id = 2
        """
    ).fetchone()

    print("Updated AED:", row)
PY
   ```
