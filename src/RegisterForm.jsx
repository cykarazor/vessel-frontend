import React, { useState } from 'react';
import { TextField, Button, Stack, Typography, Alert, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', p: 4, mt: 8 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Create Account
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            fullWidth
          />
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
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" type="submit" size="large" fullWidth>
            Register
          </Button>
          <Typography variant="body2" textAlign="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  );
}
