// src/components/VoyageList.jsx
import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

export default function VoyageList({ voyages, onSelect }) {
  return (
    <List disablePadding>
      {voyages.map((voyage, index) => (
        <ListItem
          key={voyage._id}
          onClick={() => onSelect(voyage)}
          sx={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // 🦓 Zebra striping
            "&:hover": {
              backgroundColor: "#e0f7fa", // 💡 Hover color
            },
            cursor: "pointer", // 👉 Pointer on hover
            transition: "background-color 0.2s ease-in-out", // 🎨 Smooth transition
          }}
        >
          <ListItemText
            primary={
              <Typography sx={{ fontWeight: "bold" }}>
                {voyage.vesselName} - {voyage.voyageNumber}
              </Typography>
            }
            secondary={
              voyage.departurePort && voyage.arrivalPort
                ? `${voyage.departurePort} → ${voyage.arrivalPort}`
                : null
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
