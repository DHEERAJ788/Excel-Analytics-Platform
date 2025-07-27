const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/excelAnalytics", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Define a flexible schema (because Excel columns can vary)
const ExcelDataSchema = new mongoose.Schema({}, { strict: false });
const ExcelData = mongoose.model("ExcelData", ExcelDataSchema);

// Setup multer to temporarily store uploaded files
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Delete the uploaded file after reading
    fs.unlinkSync(req.file.path);

    // Save data to MongoDB
    await ExcelData.insertMany(jsonData);

    res.json({ data: jsonData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
