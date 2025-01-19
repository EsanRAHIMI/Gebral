const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// مسیر صحیح را برای محیط Docker یا سرور تنظیم کنید
const selectedFiles = [
    path.join(__dirname, '../server.js'),
    path.join(__dirname, '../config.js')
];

router.get('/', async (req, res) => {
    try {
        const fileContents = selectedFiles.map(file => {
            if (!fs.existsSync(file)) {
                throw new Error(`File not found: ${file}`);
            }
            return {
                file: path.basename(file),
                content: fs.readFileSync(file, 'utf-8')
            };
        });
        res.json(fileContents);
    } catch (err) {
        res.status(500).json({ error: 'Error reading files', details: err.message });
    }
});

module.exports = router;
