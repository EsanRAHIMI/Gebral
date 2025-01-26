import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; name: string }>({
    id: "N/A",
    name: "Guest",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name && parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }

    document.title = `GEBRAL 🔮 | Dashboard - ${user.name}`;
    return () => {
      document.title = "GEBRAL"; // مقدار پیش‌فرض هنگام خروج از صفحه
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container">
      <h1 className="heading">Welcome, {user.name}</h1>
      <p className="subheading">
        Your unique ID: <strong>{user.id}</strong>
      </p>
      <Link to="/tasks">
        <button className="btn-primary">Manage Your Tasks</button>
      </Link>
      <button onClick={handleLogout} className="btn-secondary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
