import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [medicines, setMedicines] = useState([
    { name: "Paracetamol", time: "08:00", status: "pending" }
  ]);

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [alertMed, setAlertMed] = useState(null);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState("😊");

  // Voice Alert
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  // Reminder Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const current =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      medicines.forEach((med, index) => {
        if (med.time === current && med.status === "pending") {
          setAlertMed(index);
          speak(`Time to take ${med.name}`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [medicines]);

  // Add medicine
  const addMedicine = () => {
    if (name && time) {
      setMedicines([
        ...medicines,
        { name, time, status: "pending" }
      ]);
      setName("");
      setTime("");
    }
  };

  // Mark taken
  const markTaken = (index) => {
    const updated = [...medicines];
    updated[index].status = "taken";
    setMedicines(updated);
    setStreak(streak + 1);
    setAlertMed(null);
  };

  // Snooze
  const snooze = () => {
    speak("Reminder snoozed for 5 minutes");
    setAlertMed(null);
    setTimeout(() => {
      setAlertMed(0);
    }, 300000);
  };

  // Mood message
  const moodMessage =
    mood === "😊"
      ? "Great! Keep taking your medicines 💙"
      : mood === "😐"
      ? "Stay consistent 👍"
      : "Please take care 😔";

  return (
    <div className="container">
      <h1>💊 Smart Alerts</h1>

      {/* Mood */}
      <div className="mood">
        <span onClick={() => setMood("😊")}>😊</span>
        <span onClick={() => setMood("😐")}>😐</span>
        <span onClick={() => setMood("😞")}>😞</span>
      </div>

      <p>{moodMessage}</p>

      <h3>🔥 Streak: {streak}</h3>

      {/* Add Medicine */}
      <div className="card">
        <input
          type="text"
          placeholder="Medicine"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addMedicine}>Add</button>
      </div>

      {/* List */}
      {medicines.map((m, i) => (
        <div key={i} className={`item ${m.status}`}>
          💊 {m.name} ⏰ {m.time}
        </div>
      ))}

      {/* Alert Popup */}
      {alertMed !== null && (
        <div className="popup">
          <h2>🔔 Reminder</h2>
          <p>Take {medicines[alertMed].name}</p>

          <button onClick={() => markTaken(alertMed)}>✅ Taken</button>
          <button onClick={snooze}>⏰ Snooze</button>
        </div>
      )}
    </div>
  );
};

export default App;