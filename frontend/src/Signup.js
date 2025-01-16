import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const Signup = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch(`${BACKEND_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Signup failed:', errorData.message);
                    throw new Error(errorData.message || 'Signup failed');
                }
                navigate('/');
            }
            catch (err) {
                console.error(err);
            }
        },
    });
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h1", { children: "Sign Up" }), _jsxs("form", { onSubmit: formik.handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Name:" }), _jsx("input", { type: "text", name: "name", value: formik.values.name, onChange: formik.handleChange, onBlur: formik.handleBlur }), formik.touched.name && formik.errors.name ? _jsx("p", { children: formik.errors.name }) : null] }), _jsxs("div", { children: [_jsx("label", { children: "Email:" }), _jsx("input", { type: "email", name: "email", value: formik.values.email, onChange: formik.handleChange, onBlur: formik.handleBlur }), formik.touched.email && formik.errors.email ? _jsx("p", { children: formik.errors.email }) : null] }), _jsxs("div", { children: [_jsx("label", { children: "Password:" }), _jsx("input", { type: "password", name: "password", value: formik.values.password, onChange: formik.handleChange, onBlur: formik.handleBlur }), formik.touched.password && formik.errors.password ? _jsx("p", { children: formik.errors.password }) : null] }), _jsx("button", { type: "submit", children: "Sign Up" })] })] }));
};
export default Signup;
