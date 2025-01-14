function generateLogHTML(data) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Log</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; }
          .container { max-width: 800px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
          h1 { color: #444; text-align: center; margin-bottom: 20px; }
          h2 { color: #555; border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 8px; overflow: auto; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 14px; color: #212529; }
          .section { margin-bottom: 20px; }
          .section h2 { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Server Log</h1>
          <div class="section">
            <h2>Execution Time</h2>
            <pre>${new Date().toISOString()}</pre>
          </div>
          <div class="section">
            <h2>Log Details</h2>
            <pre>${data.replace(/\\[.*?m/g, '')}</pre>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  module.exports = { generateLogHTML };
  