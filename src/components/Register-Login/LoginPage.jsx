import React, { useState } from "react";
import { loginUser } from "../../api/authAPI";
import "./Registration-Login-Style.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage({ setUserType, setUserId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      const data = await loginUser(email, password, userType);
      const { userId, userRole } = data;
      setErrorMessage("");
      setSuccessMessage("Login successful!");
      setUserType(userRole);
      setUserId(userId);
      console.log(userId)

      switch (userType) {
        case "supplier":

          navigate(`/supplier-home/${userId}`);
          break;
        case "transporter":
          navigate(`/transporter-home/${userId}`);
          break;
        case "manufacturer":
          navigate(`/manufacturer-home/${userId}`);
          break;
        // case "distributor":
        //   navigate(`/distributor-home/${userId}`);
        //   break;
        // case "retailer":
        //   navigate(`/retailer-home/${userId}`);
        //   break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
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
                type={showPassword ? "text" : "password"} // Toggle password field
                name="password"
                className="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="uil uil-lock icon"></i>
              <i
                className={`uil ${showPassword ? "uil-eye" : "uil-eye-slash"
                  } showHidePw`}
                onClick={togglePasswordVisibility}
              ></i>
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
              <div className="error-message">
                <div className="error">{errorMessage}</div>
              </div>
            )}

            {successMessage && <div className="success">{successMessage}</div>}
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
