import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Alert, Stack } from "@mui/material";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained">
          Login
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </form>
  );
}
