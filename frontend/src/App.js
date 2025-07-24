import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [busNumber, setBusNumber] = useState("");
  const [busInfo, setBusInfo] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [title, setTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [expanded, setExpanded] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setExpanded("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBusInfo = async () => {
    const res = await fetch(`http://localhost:5000/bus/${busNumber}`);
    const data = await res.json();
    if (data.error) {
      setBusInfo(null);
      alert("Bus not found");
    } else {
      setBusInfo(data);
    }
  };

  const submitComplaint = async () => {
    const res = await fetch("http://localhost:5000/complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bus_number: busNumber,
        message: complaint,
      }),
    });
    const data = await res.json();
    alert(data.status);
  };

  const fetchAnnouncements = async () => {
    const res = await fetch("http://localhost:5000/announcements");
    const data = await res.json();
    setAnnouncements(data);
  };

  const postAnnouncement = async () => {
    const res = await fetch("http://localhost:5000/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message: announcementMsg }),
    });
    const data = await res.json();
    alert(data.status);
    setTitle("");
    setAnnouncementMsg("");
    fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const clearBusInfo = () => {
  setBusNumber("");
  setBusInfo(null);
};


  return (
    <div className="main-container">
      <h1>🚍 Bus Insights App</h1>
      <div className="app" ref={cardRef}>
        <div className="left-section">
          <div className="left-top">
            {/* Search Bus */}
            <div className="card" onClick={() => setExpanded("bus")}>
              <h3>🔍 Search Bus</h3>
              {expanded === "bus" && (
                <div className="card-content">
                  <div className="search-bar">
                    <input
                      placeholder="Enter Bus Number"
                      value={busNumber}
                      onChange={(e) => setBusNumber(e.target.value)}
                    />
                    <div className="search-buttons">
                      <button className="all-btn" onClick={fetchBusInfo}>
                        Search
                      </button>
                      <button className="all-btn" onClick={clearBusInfo}>
                        Clear
                      </button>
                    </div>
                  </div>
                  {busInfo && (
                    <div className="bus-info">
                      <p><strong>Route:</strong> {busInfo.route}</p>
                      <p><strong>Driver:</strong> {busInfo.driver}</p>
                      <p><strong>Capacity:</strong> {busInfo.capacity}</p>
                      <p><strong>Current Passengers:</strong> {busInfo.current_passengers}</p>
                      <p><strong>ETA:</strong> {busInfo.eta}</p>
                      <p><strong>Morning Pickup:</strong> {busInfo.morning_pickup_time}</p>
                      <p><strong>Morning Drop:</strong> {busInfo.morning_drop_time}</p>
                      <p><strong>Evening Pickup:</strong> {busInfo.evening_pickup_time}</p>
                      <p><strong>Evening Drop:</strong> {busInfo.evening_drop_time}</p>
                      <p><strong>Bus Type:</strong> {busInfo.bus_type}</p>
                      <p><strong>Incharge:</strong> {busInfo.bus_incharge}</p>
                      <p><strong>Contact:</strong> {busInfo.incharge_contact}</p>
                      <div className="stops-container">
                        <strong>Stops:</strong>
                        <br />
                        {busInfo.stops && busInfo.stops.length > 0 ? (
                          busInfo.stops.map((stop, index) => (
                            <span className="stop-pill" key={index}>{stop}</span>
                          ))
                        ) : (
                          <p>No stop data available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Complaint */}
            <div className="card" onClick={() => setExpanded("complaint")}>
              <h3>😠 Complaint</h3>
              {expanded === "complaint" && (
                <div className="card-content">
                  <div className="search-bar">
                    <textarea
                      className="complaint-textarea"
                      placeholder="Your complaint"
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      rows={3}
                    />
                    <button className="all-btn" onClick={submitComplaint}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post Announcement */}
            <div className="card" onClick={() => setExpanded("announcement")}>
              <h3>📢 Post Announcement</h3>
              {expanded === "announcement" && (
                <div className="card-content">
                  <div className="search-bar">
                    <input
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                      className="msg-textarea"
                      placeholder="Message"
                      value={announcementMsg}
                      onChange={(e) => setAnnouncementMsg(e.target.value)}
                      rows={3}
                    />
                    <div>
                      <button className="all-btn" onClick={postAnnouncement}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="card">
            <h3>📜 All Announcements</h3>
            <div className="card-content">
              {announcements.length === 0 ? (
                <p>No announcements yet.</p>
              ) : (
                <ul>
                  {announcements.map((a, idx) => (
                    <li key={idx}>
                      <strong>{a.title}</strong>: {a.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

