import React, { useEffect, useState } from 'react';

const Logger = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/logs'); // آدرس بک‌اند
      const data = await response.json();
      setLogs(data); // نمایش لاگ‌ها در صفحه
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '5px', marginTop: '20px' }}>
      <h3>Logs:</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default Logger;
