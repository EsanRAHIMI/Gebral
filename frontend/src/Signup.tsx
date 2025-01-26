import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    document.title = `GEBRAL 🔮 | Sign Up`;
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z0-9-_.]+$/, "Only letters, numbers, '-', '_', and '.' are allowed.")
        .min(3, "Name must be at least 3 characters long")
        .required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSignupError("");

      try {
        const response = await fetch(`${BACKEND_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Signup failed");
        }

        const data = await response.json();

        // ذخیره شناسه‌ی یونیک و نام کاربر در localStorage
        localStorage.setItem("user", JSON.stringify({ id: data.id, name: values.name }));
        localStorage.setItem("token", data.token);

        navigate("/dashboard");
      } catch (err) {
        if (err instanceof Error) {
          setSignupError(err.message);
        } else {
          setSignupError("An unexpected error occurred");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container">
      <h2 className="heading">Sign Up</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps("name")}
            className="input-field"
            disabled={isSubmitting}
          />
          {formik.touched.name && formik.errors.name && <div className="error-message">{formik.errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className="input-field"
            disabled={isSubmitting}
          />
          {formik.touched.email && formik.errors.email && <div className="error-message">{formik.errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className="input-field"
            disabled={isSubmitting}
          />
          {formik.touched.password && formik.errors.password && <div className="error-message">{formik.errors.password}</div>}
        </div>

        {signupError && <div className="error-message">{signupError}</div>}

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
