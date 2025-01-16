import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:5001/logs'); // آدرس بک‌اند
            const data = await response.json();
            setLogs(data); // نمایش لاگ‌ها در صفحه
        }
        catch (err) {
            console.error('Failed to fetch logs:', err);
        }
    };
    useEffect(() => {
        fetchLogs();
    }, []);
    return (_jsxs("div", { style: { padding: '20px', background: '#f9f9f9', borderRadius: '5px' }, children: [_jsx("h1", { children: "Logs" }), _jsx("ul", { children: logs.map((log, index) => (_jsx("li", { children: log }, index))) })] }));
};
export default LogsPage;
