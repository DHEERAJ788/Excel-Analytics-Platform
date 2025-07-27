const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for frontend access
app.use(cors());

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    res.json({ data });
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    res.status(500).json({ message: 'Failed to parse Excel file' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
