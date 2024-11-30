import { useState, useRef, useCallback, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
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

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");

    await axios({
      method: "post",
      url: "/admin/login",
      data,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.access_token);
        navigate("/main/movies");
        setStatus("idle");
      })
      .catch((e) => {
        console.log(e);
        setStatus("idle");
        // alert(e.response.data.message);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              ref={emailRef}
              value={email}
              onChange={(e) => handleOnChange(e, "email")}
            />
            {debounceState && isFieldsDirty && email === "" && (
              <span className="error-message">This field is required</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password"
                type={isShowPassword ? "text" : "password"}
                placeholder="Enter your password"
                ref={passwordRef}
                value={password}
                onChange={(e) => handleOnChange(e, "password")}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={handleShowPassword}
              >
                {isShowPassword ? "Hide" : "Show"}
              </button>
            </div>
            {debounceState && isFieldsDirty && password === "" && (
              <span className="error-message">This field is required</span>
            )}
          </div>
          <button
            className="login-btn"
            type="button"
            disabled={status === "loading"}
            onClick={() => {
              if (status === "loading") return;
              if (email && password) {
                handleLogin();
              } else {
                setIsFieldsDirty(true);
                if (email === "") emailRef.current.focus();
                if (password === "") passwordRef.current.focus();
              }
            }}
          >
            {status === "idle" ? "Login" : "Loading..."}
          </button>
          <div className="register-link">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
