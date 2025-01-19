const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// لیست فایل‌های انتخابی
const selectedFiles = [
    'backend/server.js',
    'backend/config.js',
    'frontend/src/App.tsx'
];

// گرفتن محتوای فایل‌ها
router.get('/', async (req, res) => {
    try {
        const fileContents = selectedFiles.map(file => {
            const filePath = path.join(__dirname, '..', file);
            return {
                file: file,
                content: fs.readFileSync(filePath, 'utf-8')
            };
        });
        res.json(fileContents);
    } catch (err) {
        res.status(500).json({ error: 'Error reading files', details: err.message });
    }
});

module.exports = router;
