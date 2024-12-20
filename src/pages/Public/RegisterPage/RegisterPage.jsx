import { useState, useRef, useCallback, useEffect } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
  });
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const userInputDebounce = useDebounce(formData, 2000);
  const [debounceState, setDebounceState] = useState(false);

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDebounceState(false);
    setIsFieldsDirty(true);
  }, []);

  const handleRegister = useCallback(async () => {
    const { email, password, firstName, middleName, lastName, contactNo } = formData;

    if (!email || !password || !firstName || !lastName || !contactNo) {
      alert("All required fields must be filled!");
      return;
    }

    setStatus("loading");

    try {
      const response = await axios.post("/admin/register", formData, {
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
  }, [formData, navigate]);

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Create Account</h1>
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          {["firstName", "middleName", "lastName", "contactNo", "email", "password"].map(
            (field, index) => (
              <div className="input-group" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace("No", " Number")}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "password" && !isShowPassword ? "password" : "text"}
                  onChange={handleOnChange}
                  placeholder={`Enter your ${field}`}
                  aria-required={field !== "middleName"}
                />
                {field === "password" && (
                  <button
                    type="button"
                    className="register-show-password-btn"
                    onClick={handleShowPassword}
                  >
                    {isShowPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>
            )
          )}
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