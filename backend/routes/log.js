const express = require('express');
const router = express.Router();
const { generateLogHTML } = require('../services/logService');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// مسیر /log
router.get('/', (req, res) => {
  const password = req.query.password;
  const envPassword = process.env.LOG_PASSWORD?.trim();

  if (!envPassword) {
    return res.status(500).send('<pre>Error: LOG_PASSWORD is not set in .env</pre>');
  }
  if (password?.trim() !== envPassword) {
    return res.status(403).send('<pre>Access Denied: Invalid Password</pre>');
  }

  const scriptPath = path.join(__dirname, '../../check_versions.sh');
  const logFilePath = path.join(__dirname, '../../check_versions.log');

  exec(`bash ${scriptPath}`, (error) => {
    if (error) {
      return res.status(500).send(`<pre>Error executing script:\n${error.message}</pre>`);
    }

    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(`<pre>Error reading log file:\n${err.message}</pre>`);
      }
      res.send(generateLogHTML(data));
    });
  });
});

module.exports = router;
