import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const validTypes = {
  p: "Prime",
  f: "Fibonacci",
  e: "Even",
  r: "Random"
};

const WINDOW_SIZE = 10;

function App() {
  const [selectedType, setSelectedType] = useState("p");
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [window, setWindow] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`/test/${selectedType}`, { timeout: 2000 });
      const numbers = response.data.numbers || [];

      const updatedWindow = [...window];
      numbers.forEach((num) => {
        if (!updatedWindow.includes(num)) {
          updatedWindow.push(num);
        }
      });

      const trimmedWindow = updatedWindow.slice(-WINDOW_SIZE);
      const avg =
        trimmedWindow.reduce((sum, num) => sum + num, 0) / trimmedWindow.length;

      setFetchedNumbers(numbers);
      setWindow(trimmedWindow);
      setAverage(avg.toFixed(2));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch numbers. Try again.");
    }
  };

  return (
    <div className="App">
      <h1>📊 Average Calculator</h1>

      <div className="controls">
        <label>Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {Object.entries(validTypes).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="results">
        <h3>🔢 Fetched Numbers:</h3>
        <p>{fetchedNumbers.length ? fetchedNumbers.join(", ") : "None"}</p>

        <h3>📦 Moving Window (Last 10 Unique Numbers):</h3>
        <p>{window.length ? window.join(", ") : "Empty"}</p>

        <h3>📈 Average:</h3>
        <p>{average ?? "Not calculated yet"}</p>
      </div>
    </div>
  );
}

export default App;
