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

export default function VoyageForm({
  open,
  editMode,
  form = {},
  selectedVoyage,
  onClose,
  onChange,
  onDateChange,
  onSubmit,
}) {
  const cargo = form.cargo || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        {editMode ? "Edit Voyage" : "Voyage Details"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" noValidate>
          {/* Vessel & Voyage Number */}
          <Typography variant="h6" gutterBottom>Vessel & Voyage Number</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vessel Name"
                name="vesselName"
                value={form.vesselName || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Voyage Number"
                name="voyageNumber"
                value={form.voyageNumber || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          {/* Departure Info */}
          <Typography variant="h6" gutterBottom>Departure Info</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Departure Date"
                value={form.departureDate || null}
                onChange={(date) => onDateChange("departureDate", date)}
                slotProps={{ textField: { fullWidth: true, disabled: !editMode } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Departure Port"
                name="departurePort"
                value={form.departurePort || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Departure Country"
                name="departureCountry"
                value={form.departureCountry || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          {/* Arrival Info */}
          <Typography variant="h6" gutterBottom>Arrival Info</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Arrival Date"
                value={form.arrivalDate || null}
                onChange={(date) => onDateChange("arrivalDate", date)}
                slotProps={{ textField: { fullWidth: true, disabled: !editMode } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Arrival Port"
                name="arrivalPort"
                value={form.arrivalPort || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Arrival Country"
                name="arrivalCountry"
                value={form.arrivalCountry || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          {/* Cargo Info */}
          <Typography variant="h6" gutterBottom>Cargo Info</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Type"
                name="cargo.type"
                value={cargo.type || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Total"
                name="cargo.total"
                value={cargo.total || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth disabled={!editMode}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="cargo.quantityUnit"
                  value={cargo.quantityUnit || "MT"}
                  onChange={onChange}
                  label="Unit"
                >
                  <MenuItem value="MT">MT</MenuItem>
                  <MenuItem value="KG">KG</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Rate USD"
                name="cargo.rateUSD"
                value={cargo.rateUSD || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          {/* Agent & Consignee */}
          <Typography variant="h6" gutterBottom>Agent & Consignee</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Agent"
                name="agent"
                value={form.agent || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Consignee"
                name="consignee"
                value={form.consignee || ""}
                onChange={onChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          </Grid>

          {/* Remarks */}
          <Typography variant="h6" gutterBottom>Remarks</Typography>
          <TextField
            label="Remarks"
            name="remarks"
            value={form.remarks || ""}
            onChange={onChange}
            fullWidth
            multiline
            rows={2}
            disabled={!editMode}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        {editMode && <Button onClick={onSubmit} variant="contained">Save</Button>}
      </DialogActions>
    </Dialog>
  );
}
