import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { userContext } from "../../components/common/Context/UserContext";

import './LoginPage.css';


import {  Envelope, Lock, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

const LoginPage = () => {
  let {setToken}= useContext(userContext)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errMes, setMes] = useState("");

 
  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "At least 8 characters, one uppercase, one lowercase, and one digit"
      )
      .required("Password is required"),
  });

  // API Call Function
  async function submitLoginPage(values) {
    try {
      const { data } = await axios.post(
        "https://hf1bv21q-5049.uks1.devtunnels.ms/api/AuthUser/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
     
     localStorage.setItem('adminToken', data.token);
     localStorage.setItem('userToken', data.token);
setToken(data.token)
      
     
     localStorage.setItem('user', JSON.stringify({
       id: data.user.userId,
       email: data.user.email,
       role: data.user.role,
   
     }));

     
     if (data.user.role === 'admin') {
       navigate("/admin"); 
     } else if (data.user.role === 'Technician'){
      navigate(`/technician-dashboard/${data.user.id}`)
     }else{
      navigate("/");
     }
     
   } catch (err) {
     console.error("API Error:", err);
     setMes(err.response?.data?.message || "Network error, please check your connection.");
   }
 }

 
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitLoginPage,
  });

  return (
    <div className="custom-bg vh-100 d-flex align-items-center justify-content-center py-5 ">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4  form-card">
              <div className=" p-4 p-md-5">
                <h2 className="text-center mb-4 fw-bold text-success">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4 position-relative">
                    <div className="form-floating input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <Envelope className="text-success" />
                      </span>
                      <input
                        type="email"
                        className={`form-control custom-input border-start-0 ps-0 ${
                          formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                        }`}
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      <label htmlFor="email" className="ms-4">Email address</label>
                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">{formik.errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 position-relative">
                    <div className="form-floating input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <Lock className="text-success" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control custom-input border-start-0 ps-0 ${
                          formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                        }`}
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      <label htmlFor="password" className="ms-4">Password</label>
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y text-success bg-transparent border-0 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 5 }}
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </button>
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">{formik.errors.password}</div>
                      )}
                    </div>
                  </div>
                  {errMes && (
                    <div className="alert alert-danger" role="alert">
                      {errMes}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-3 py-3 custom-button"
                    disabled={!(formik.isValid && formik.dirty)}
                  >
                    Login
                  </button>

                  <p className="text-center mb-0">
                    Don't have account? {' '}
                    <Link to='/signup' className="text-success text-decoration-none">Sign up</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;