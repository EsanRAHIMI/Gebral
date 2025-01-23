import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Invalid credentials");

        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.id, name: data.email })
        );

        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            {...formik.getFieldProps("email")}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            {...formik.getFieldProps("password")}
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Back
          </button>
      </form>
    </div>
  );
};

export default Login;
