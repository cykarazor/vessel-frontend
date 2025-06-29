// src/components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Header({ user, onLogout }) {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Vessel Tracker
        </Typography>
        {user && (
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
