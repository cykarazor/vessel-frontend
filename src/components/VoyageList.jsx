// src/components/VoyageList.jsx
import React from "react";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";

export default function VoyageList({ voyages, onSelect }) {
  return (
    <List>
      {voyages.map((voyage) => (
        <ListItem button key={voyage._id} onClick={() => onSelect(voyage)}>
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
