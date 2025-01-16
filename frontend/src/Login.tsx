// /Users/ehsanrahimi/Gabrel/app/frontend/src/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Form.css';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('ایمیل نامعتبر است').required('ایمیل الزامی است'),
      password: Yup.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').required('رمز عبور الزامی است'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('ورود ناموفق بود');
        }

        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="form-container">
      <h2>ورود</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">ایمیل</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}

        <label htmlFor="password">رمز عبور</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}

        <button type="submit">ورود</button>
      </form>
    </div>
  );
};

export default Login;
