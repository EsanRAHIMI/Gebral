import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }
            catch (error) {
                console.error(error);
            }
        },
    });
    return (_jsxs("div", { className: "form-container", children: [_jsx("h2", { children: "\u0648\u0631\u0648\u062F" }), _jsxs("form", { onSubmit: formik.handleSubmit, children: [_jsx("label", { htmlFor: "email", children: "\u0627\u06CC\u0645\u06CC\u0644" }), _jsx("input", { id: "email", name: "email", type: "email", onChange: formik.handleChange, value: formik.values.email }), formik.errors.email ? _jsx("div", { className: "error", children: formik.errors.email }) : null, _jsx("label", { htmlFor: "password", children: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631" }), _jsx("input", { id: "password", name: "password", type: "password", onChange: formik.handleChange, value: formik.values.password }), formik.errors.password ? _jsx("div", { className: "error", children: formik.errors.password }) : null, _jsx("button", { type: "submit", children: "\u0648\u0631\u0648\u062F" })] })] }));
};
export default Login;
