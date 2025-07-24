from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from twilio.rest import Client

app = Flask(__name__)
CORS(app)


DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')
BUSES_FILE = os.path.join(DATA_PATH, 'buses.json')
COMPLAINTS_FILE = os.path.join(DATA_PATH, 'complaints.json')

with open(BUSES_FILE) as f:
    buses = json.load(f)

ANNOUNCEMENTS_FILE = os.path.join(DATA_PATH, 'announcements.json')

@app.route("/announcements", methods=["GET"])
def get_announcements():
    if not os.path.exists(ANNOUNCEMENTS_FILE):
        return jsonify([])

    with open(ANNOUNCEMENTS_FILE) as f:
        announcements = json.load(f)
    return jsonify(announcements)

@app.route("/announcements", methods=["POST"])
def post_announcement():
    data = request.get_json()
    new_announcement = {
        "title": data["title"],
        "message": data["message"]
    }

    announcements = []
    if os.path.exists(ANNOUNCEMENTS_FILE):
        with open(ANNOUNCEMENTS_FILE) as f:
            announcements = json.load(f)

    announcements.append(new_announcement)

    with open(ANNOUNCEMENTS_FILE, "w") as f:
        json.dump(announcements, f, indent=2)

    return jsonify({"status": "Announcement posted successfully"})



@app.route("/bus/<bus_number>", methods=["GET"])
def get_bus_info(bus_number):
    bus = buses.get(bus_number)
    if bus:
        return jsonify(bus)
    return jsonify({"error": "Bus not found"}), 404

@app.route("/complaint", methods=["POST"])
def complaint():
    data = request.get_json()
    complaint_entry = {
        "bus_number": data["bus_number"],
        "message": data["message"]
    }

    with open(COMPLAINTS_FILE, "a") as f:
        f.write(json.dumps(complaint_entry) + "\n")

    return jsonify({"status": "Complaint submitted"})

@app.route("/send_sms", methods=["POST"])
def send_sms():
    print("🔔 /send_sms endpoint hit")  # <-- Add this

    data = request.get_json()
    print("📥 Request data:", data)  # <-- Debug incoming data

    bus_number = data["bus_number"].upper()
    message_text = data["message"]

    bus = buses.get(bus_number)
    if not bus:
        print("❌ Bus not found")
        return jsonify({"error": "Bus not found"}), 404

    for parent in bus.get("parents", []):
        mobile = parent["mobile"]
        if not mobile.startswith("+"):
            mobile = "+91" + mobile

        try:
            message = client.messages.create(
                body=message_text,
                from_=TWILIO_PHONE_NUMBER,
                to=mobile
            )
            print(f"✅ SMS sent to {mobile}: SID {message.sid}")
        except Exception as e:
            print(f"❌ Failed to send SMS to {mobile}: {e}")

    return jsonify({"status": "SMS process completed"})

if __name__ == "__main__":
    app.run(debug=True)
