// src/components/VoyageList.jsx
import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

export default function VoyageList({ voyages, onSelect, loading = false }) {
  // Pagination state: current page and items per page
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination indexes
  const totalPages = Math.ceil(voyages.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentVoyages = voyages.slice(startIndex, startIndex + itemsPerPage);

  // Handlers to go to prev/next page with boundary checks
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  if (loading) {
    // Show loading spinner when loading is true
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (voyages.length === 0) {
    // Show friendly message if no voyages available
    return (
      <Typography sx={{ textAlign: "center", py: 4 }} color="text.secondary">
        No voyages found.
      </Typography>
    );
  }

  return (
    <>
      <List disablePadding>
        {currentVoyages.map((voyage, index) => (
          <ListItem
            key={voyage._id}
            onClick={() => onSelect(voyage)}
            sx={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Zebra striping
              "&:hover": {
                backgroundColor: "#e0f7fa", // Hover color
              },
              cursor: "pointer", // Pointer cursor on hover
              transition: "background-color 0.2s ease-in-out",
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
                  ? `${voyage.departurePort} → ${voyage.arrivalPort} · Tap for full details`
                  : "Tap for full details"
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          px: 1,
        }}
      >
        <Button
          onClick={handlePrevPage}
          disabled={page === 1}
          variant="outlined"
          size="small"
        >
          Previous
        </Button>

        <Typography variant="body2" color="text.secondary">
          Page {page} of {totalPages}
        </Typography>

        <Button
          onClick={handleNextPage}
          disabled={page === totalPages}
          variant="outlined"
          size="small"
        >
          Next
        </Button>
      </Box>
    </>
  );
}
