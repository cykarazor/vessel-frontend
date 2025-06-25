import React, { useState, useContext } from 'react';
import { TextField, Button, Stack, Typography, Alert, Paper } from '@mui/material';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/voyages');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', p: 4, mt: 8 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" type="submit" size="large" fullWidth>
            Login
          </Button>
          <Typography variant="body2" textAlign="center">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  );
}
