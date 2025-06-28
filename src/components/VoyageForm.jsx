// src/components/VoyageForm.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export default function VoyageForm({
  open,
  editMode,
  form,
  selectedVoyage,
  onClose,
  onChange,
  onDateChange,
  onSubmit,
  setEditMode,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        {editMode ? (selectedVoyage?._id ? "Edit Voyage" : "Add Voyage") : "Voyage Details"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" noValidate>
          {/* Vessel & Voyage Number */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Vessel & Voyage Number
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vessel Name"
                  name="vesselName"
                  value={form.vesselName}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Voyage Number"
                  name="voyageNumber"
                  value={form.voyageNumber}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Departure Info */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Departure Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Departure Date"
                  value={form.departureDate}
                  onChange={(date) => onDateChange("departureDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Departure Port"
                  name="departurePort"
                  value={form.departurePort}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Departure Country"
                  name="departureCountry"
                  value={form.departureCountry}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Arrival Info */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Arrival Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Arrival Date"
                  value={form.arrivalDate}
                  onChange={(date) => onDateChange("arrivalDate", date)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Arrival Port"
                  name="arrivalPort"
                  value={form.arrivalPort}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Arrival Country"
                  name="arrivalCountry"
                  value={form.arrivalCountry}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Cargo Info */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Cargo Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Cargo Type"
                  name="cargo.type"
                  value={form.cargo.type}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Total"
                  name="cargo.total"
                  value={form.cargo.total}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth disabled={!editMode}>
                  <InputLabel id="quantity-unit-label">Unit</InputLabel>
                  <Select
                    labelId="quantity-unit-label"
                    label="Unit"
                    name="cargo.quantityUnit"
                    value={form.cargo.quantityUnit}
                    onChange={onChange}
                  >
                    <MenuItem value="MT">MT</MenuItem>
                    <MenuItem value="KG">KG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Rate (USD)"
                  name="cargo.rateUSD"
                  value={form.cargo.rateUSD}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Agent & Consignee */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Agent & Consignee
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Agent"
                  name="agent"
                  value={form.agent}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Consignee"
                  name="consignee"
                  value={form.consignee}
                  onChange={onChange}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Remarks */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Remarks
            </Typography>
            <TextField
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={onChange}
              multiline
              rows={2}
              fullWidth
              disabled={!editMode}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="contained">
              Save
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)} variant="contained" startIcon={<EditIcon />}>
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
