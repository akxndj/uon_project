import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/user.css";
import { useToast } from "../context/ToastContext";
import ReturnButton from "../components/ReturnButton";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { push } = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Required";

    if (!lastName.trim()) newErrors.lastName = "Required";

    if (username.length < 3) newErrors.username = "Min 3 characters";

    if (!emailRegex.test(email)) newErrors.email = "Invalid email";

    if (!/^\d+$/.test(studentId)) newErrors.studentId = "Numbers only";

    if (phone.replace(/\D/g, "").length !== 10)
      newErrors.phone = "Must be 10 digits";

    if (password.length < 6)
      newErrors.password = "Min 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const userData = {
        fName: firstName,
        lName: lastName,
        username,
        email,
        stdNo: studentId,
        phone: Number(phone.replace(/\D/g, "")),
        password,
        role: "user",
      };

      const response = await fetch("http://localhost:9999/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      push({
        title: "Account created",
        message: "Please sign in to continue.",
        tone: "success",
      });

      navigate("/login");
    } catch (error) {
      push({
        title: "Registration failed",
        message: error.message,
        tone: "danger",
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <ReturnButton fallback="/login" />
        <h1>Register Account</h1>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              className={errors.firstName ? "input-error" : ""}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              className={errors.lastName ? "input-error" : ""}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              className={errors.username ? "input-error" : ""}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              className={errors.email ? "input-error" : ""}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Student ID:</label>
            <input
              className={errors.studentId ? "input-error" : ""}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            {errors.studentId && <span className="error-text">{errors.studentId}</span>}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              className={errors.phone ? "input-error" : ""}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type={showPassword ? "text" : "password"}
                className={errors.password ? "input-error" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                👁
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="form-btn">
            Register
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="form-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;