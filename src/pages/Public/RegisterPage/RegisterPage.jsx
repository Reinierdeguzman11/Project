import { useState, useRef, useCallback, useEffect } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const contactNoRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce(
    { email, password, firstName, middleName, lastName, contactNo },
    2000
  );
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "middleName":
        setMiddleName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "contactNo":
        setContactNo(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo };
    setStatus("loading");

    try {
      const response = await axios.post("/admin/register", data, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      localStorage.setItem("accessToken", response.data.access_token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Create Account</h1>
        <form className="register-form">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              ref={firstNameRef}
              onChange={(e) => handleOnChange(e, "firstName")}
              placeholder="Enter your first name"
            />
          </div>
          <div className="input-group">
            <label>Middle Name</label>
            <input
              type="text"
              ref={middleNameRef}
              onChange={(e) => handleOnChange(e, "middleName")}
              placeholder="Enter your middle name"
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              ref={lastNameRef}
              onChange={(e) => handleOnChange(e, "lastName")}
              placeholder="Enter your last name"
            />
          </div>
          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="text"
              ref={contactNoRef}
              onChange={(e) => handleOnChange(e, "contactNo")}
              placeholder="Enter your contact number"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              onChange={(e) => handleOnChange(e, "email")}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group password-container">
            <label>Password</label>
            <input
              type={isShowPassword ? "text" : "password"}
              ref={passwordRef}
              onChange={(e) => handleOnChange(e, "password")}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="register-show-password-btn"
              onClick={handleShowPassword}
            >
              {isShowPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="button"
            className="register-btn"
            disabled={status === "loading"}
            onClick={handleRegister}
          >
            {status === "idle" ? "Register" : "Loading..."}
          </button>
          <div className="login-link">
            Already have an account? <a href="/">Login here</a>.
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
