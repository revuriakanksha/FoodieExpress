
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import API from "../api/foodApi";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      // Save the authentication token
      localStorage.setItem("foodie-token", token);

      // Update the logged-in user
      setUser(user);

      showToast("Login successful! Welcome back.");

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon">F</div>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Log in to your account</h1>
        <p className="auth-description">
          Your next delicious meal is just a few clicks away.
        </p>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <button
          className="btn auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}