from flask import Flask, request, jsonify
from tax_database import create_database, get_row

app = Flask(__name__)

@app.route("/data/<locator>")
def data(locator):
    conn, cur = create_database()

    entry = get_row(cur, locator)

    return jsonify(entry), 200

if __name__ == "__main__":
    app.run(debug = True)
