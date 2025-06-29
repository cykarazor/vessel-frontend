import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VoyageDetails({ open, selectedVoyage, closeModal, onEdit }) {
  if (!selectedVoyage) return null;

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        Voyage Details
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          {/* Section: Vessel & Voyage Number */}
          <Typography variant="h6" gutterBottom>Vessel & Voyage</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography><strong>Vessel:</strong> {selectedVoyage.vesselName}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Voyage No.:</strong> {selectedVoyage.voyageNumber}</Typography></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Departure */}
          <Typography variant="h6" gutterBottom>Departure</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography><strong>Date:</strong> {new Date(selectedVoyage.departureDate).toLocaleDateString()}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Port:</strong> {selectedVoyage.departurePort}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Country:</strong> {selectedVoyage.departureCountry}</Typography></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Arrival */}
          <Typography variant="h6" gutterBottom>Arrival</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography><strong>Date:</strong> {new Date(selectedVoyage.arrivalDate).toLocaleDateString()}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Port:</strong> {selectedVoyage.arrivalPort}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Country:</strong> {selectedVoyage.arrivalCountry}</Typography></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Cargo */}
          <Typography variant="h6" gutterBottom>Cargo</Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}><Typography><strong>Type:</strong> {selectedVoyage.cargo?.type}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Total:</strong> {selectedVoyage.cargo?.total}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Unit:</strong> {selectedVoyage.cargo?.quantityUnit}</Typography></Grid>
            <Grid item xs={3}><Typography><strong>Rate USD:</strong> {selectedVoyage.cargo?.rateUSD}</Typography></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Parties */}
          <Typography variant="h6" gutterBottom>Agent & Consignee</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography><strong>Agent:</strong> {selectedVoyage.agent}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Consignee:</strong> {selectedVoyage.consignee}</Typography></Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section: Remarks */}
          <Typography variant="h6" gutterBottom>Remarks</Typography>
          <Typography>{selectedVoyage.remarks || "—"}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onEdit} variant="contained">Edit</Button>
        <Button onClick={closeModal} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
