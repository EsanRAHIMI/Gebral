import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <h1 className="heading">🔮 Gebral</h1>
      <h2 className="subheading">The Unstoppable You</h2>
      <p className="subheading">Your smart AI-based life management tool.</p>
      <div className="form-group">
        <Link to="/login">
          <button className="btn-primary">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn-primary">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default App;
