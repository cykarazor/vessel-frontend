// src/components/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ mt: 4, py: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Vessel Voyage Tracker. All rights reserved.
      </Typography>
    </Box>
  );
}
