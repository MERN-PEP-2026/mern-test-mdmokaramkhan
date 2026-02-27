import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(email, password);
      const token = res.data?.data?.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8, fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 8, fontSize: 14 }}
        />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px", fontSize: 14, cursor: "pointer" }}>
          Log In
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Don't have an account?{" "}
        <a href="/">Register</a>
      </p>
    </div>
  );
}
