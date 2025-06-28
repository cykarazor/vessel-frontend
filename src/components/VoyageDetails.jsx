// VoyageDetails.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VoyageDetails({
  open,
  selectedVoyage,
  editMode,
  setEditMode,
  closeModal,
  // other props like form, handlers etc.
}) {
  if (!selectedVoyage) return null;

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: 'relative' }}>
        {editMode ? (selectedVoyage._id ? "Edit Voyage" : "Add Voyage") : "Voyage Details"}
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Your form fields here */}
        <Typography>{selectedVoyage.vesselName}</Typography>
        {/* ... */}
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={closeModal} color="secondary">Cancel</Button>
            <Button variant="contained">Save</Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)} variant="contained">Edit</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
