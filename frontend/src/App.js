import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    setError(null);
    setLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExcelData(response.data.data);
    } catch (err) {
      setError("Failed to upload and parse file.");
    }
    setLoading(false);
  };

  // Identify numeric keys for chart (e.g. Sales)
  const numericKeys = excelData.length
    ? Object.keys(excelData[0]).filter(
        (key) => typeof excelData[0][key] === "number"
      )
    : [];

  return (
    <div>
      <h1>Excel Analytics Platform</h1>
      <input type="file" onChange={handleFileUpload} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {excelData.length > 0 &&
              Object.keys(excelData[0]).map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {excelData.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {numericKeys.length > 0 && (
        <div style={{ width: "100%", height: 400, marginTop: 40 }}>
          <ResponsiveContainer>
            <LineChart data={excelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(excelData[0])[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
