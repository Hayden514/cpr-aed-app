import sqlite3
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

BASE_DIR = Path(__file__).parent
DATABASE_PATH = BASE_DIR / "database" / "aed_locations.db"

app = Flask(__name__, static_folder=None)


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/css/<path:filename>")
def css_files(filename):
    return send_from_directory(BASE_DIR / "css", filename)


@app.route("/js/<path:filename>")
def javascript_files(filename):
    return send_from_directory(BASE_DIR / "js", filename)


@app.route("/api/aeds")
def get_aeds():
    connection = get_db_connection()

    try:
        rows = connection.execute(
            """
            SELECT id, name, address, latitude, longitude, notes
            FROM aeds
            ORDER BY id
            """
        ).fetchall()

        return jsonify({"aeds": [dict(row) for row in rows]})
    finally:
        connection.close()


if __name__ == "__main__":
    app.run(debug=True)
