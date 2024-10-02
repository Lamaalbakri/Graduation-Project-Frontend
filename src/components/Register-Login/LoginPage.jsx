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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, userType } = formData;

    if (!email || !password || !userType) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    console.log(storedUsers);

    const user = storedUsers.find(
      (user) => user.email === email && user.userType === userType
    );

    if (!user) {
      setErrorMessage("No user found with this email and user type.");
      return;
    }

    if (user.password !== password) {
      setErrorMessage("Incorrect password.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    setErrorMessage("");
    alert("Login successful!");

    if (userType === "supplier") {
      navigate("/supplier");
    } else {
      navigate("/transport");
    }
  };

  return (
    <div className="main-container">
      <div className="container">
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
