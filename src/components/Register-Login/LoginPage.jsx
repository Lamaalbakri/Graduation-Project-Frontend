import React, { useState } from "react";
import "./Registration-Login-Style.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, userType } = formData;

    if (!email || !password || !userType) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8500/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage("");
        alert("Login successful!");

        switch (userType) {
          case "supplier":
            navigate("");
            break;
          case "transporter":
            navigate("");
            break;
          /*case "manufacturer":
            navigate("");
            break;
          case "distributor":
            navigate("");
            break;
          case "retailer":
            navigate("");
            break;
          default:
            navigate("");*/
        }
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <div className="containerRegisterLogin">
        <div className="form login">
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="uil uil-envelope icon"></i>
            </div>
            <div className="input-field">
              <input
                type="password"
                name="password"
                className="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="uil uil-lock icon"></i>
            </div>
            <div className="select-field">
              <select
                name="userType"
                className="stakeholders"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">Select user type</option>
                <option value="admin">Admin</option>
                <option value="transporter">Transporter</option>
                <option value="supplier">Supplier</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
              </select>
              <i className="uil uil-users-alt"></i>
            </div>
            <div className="input-field button">
              <input type="submit" value="Login" />
            </div>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="login-signup">
              <span className="text">
                Don't have an account?{" "}
                <Link to="/register" className="text signup-text">
                  Sign Up Now
                </Link>
              </span>
            </div>
          </form>
        </div>
        <footer>
          <h5>
            &copy; 2024 Supply Chain Management System. All rights reserved.
          </h5>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
