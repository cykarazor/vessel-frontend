import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  IconButton,
  List,
  ListItemText,
  Paper,
} from "@mui/material";

import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const initialForm = {
  vesselName: "",
  voyageNumber: "",
  departureDate: null,
  departurePort: "",
  departureCountry: "",
  arrivalDate: null,
  arrivalPort: "",
  arrivalCountry: "",
  cargo: {
    type: "",
    quantityUnit: "MT",
    total: "",
    rateUSD: "",
  },
  agent: "",
  consignee: "",
  remarks: "",
};

function App() {
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);

  const fetchVoyages = async () => {
    const res = await axios.get(`${API_BASE}/api/voyages`);
    setVoyages(res.data);
  };

  useEffect(() => {
    fetchVoyages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("cargo.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        cargo: { ...prev.cargo, [key]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      departureDate: form.departureDate?.toISOString(),
      arrivalDate: form.arrivalDate?.toISOString(),
    };

    if (selectedVoyage && selectedVoyage._id) {
      await axios.put(`${API_BASE}/api/voyages/${selectedVoyage._id}`, payload);
    } else {
      await axios.post(`${API_BASE}/api/voyages`, payload);
    }

    setEditMode(false);
    setSelectedVoyage(null);
    setForm(initialForm);
    fetchVoyages();
  };

  const openModal = (voyage) => {
    setSelectedVoyage(voyage);
    setEditMode(false);
    setForm({
      vesselName: voyage.vesselName || "",
      voyageNumber: voyage.voyageNumber || "",
      departureDate: voyage.departureDate ? dayjs(voyage.departureDate) : null,
      departurePort: voyage.departurePort || "",
      departureCountry: voyage.departureCountry || "",
      arrivalDate: voyage.arrivalDate ? dayjs(voyage.arrivalDate) : null,
      arrivalPort: voyage.arrivalPort || "",
      arrivalCountry: voyage.arrivalCountry || "",
      cargo: {
        type: voyage.cargo?.type || "",
        quantityUnit: voyage.cargo?.quantityUnit || "MT",
        total: voyage.cargo?.total || "",
        rateUSD: voyage.cargo?.rateUSD || "",
      },
      agent: voyage.agent || "",
      consignee: voyage.consignee || "",
      remarks: voyage.remarks || "",
    });
  };

  const openAddModal = () => {
    setSelectedVoyage({});
    setEditMode(true);
    setForm(initialForm);
  };

  const closeModal = () => {
    setSelectedVoyage(null);
    setEditMode(false);
    setForm(initialForm);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" color="primary">
            Voyages
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={openAddModal}
          >
            Add Voyage
          </Button>
        </Box>

        <List>
          {voyages.map((v) => (
            <Paper
              key={v._id}
              elevation={2}
              sx={{
                mb: 1,
                cursor: "pointer",
                p: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => openModal(v)}
            >
              <ListItemText
                primary={
                  <Typography variant="h6">{v.vesselName}</Typography>
                }
                secondary={`Voyage #${v.voyageNumber}`}
              />
            </Paper>
          ))}
        </List>

        <Dialog
          open={!!selectedVoyage}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editMode
              ? selectedVoyage._id
                ? "Edit Voyage"
                : "Add Voyage"
              : "Voyage Details"}
            <IconButton
              onClick={closeModal}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {editMode ? (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="vesselName"
                      label="Vessel Name"
                      value={form.vesselName}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="voyageNumber"
                      label="Voyage Number"
                      value={form.voyageNumber}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Departure Group */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Departure
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Departure Date"
                      value={form.departureDate}
                      onChange={(newVal) =>
                        setForm((prev) => ({ ...prev, departureDate: newVal }))
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Departure Port"
                      name="departurePort"
                      value={form.departurePort}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Departure Country"
                      name="departureCountry"
                      value={form.departureCountry}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Arrival Group */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Arrival
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Arrival Date"
                      value={form.arrivalDate}
                      onChange={(newVal) =>
                        setForm((prev) => ({ ...prev, arrivalDate: newVal }))
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Arrival Port"
                      name="arrivalPort"
                      value={form.arrivalPort}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Arrival Country"
                      name="arrivalCountry"
                      value={form.arrivalCountry}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Cargo Group */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Cargo Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="cargo.type"
                      label="Cargo Type"
                      value={form.cargo.type}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Quantity Unit"
                      name="cargo.quantityUnit"
                      value={form.cargo.quantityUnit}
                      onChange={handleChange}
                      SelectProps={{ native: true }}
                    >
                      <option value="MT">MT</option>
                      <option value="KG">KG</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total"
                      name="cargo.total"
                      value={form.cargo.total}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Rate USD"
                      name="cargo.rateUSD"
                      value={form.cargo.rateUSD}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Other */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="agent"
                      label="Agent"
                      value={form.agent}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="consignee"
                      label="Consignee"
                      value={form.consignee}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="remarks"
                      label="Remarks"
                      value={form.remarks}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                {Object.entries({
                  "Vessel Name": form.vesselName,
                  "Voyage Number": form.voyageNumber,
                  "Departure Date": form.departureDate?.format("YYYY-MM-DD"),
                  "Departure Port": form.departurePort,
                  "Departure Country": form.departureCountry,
                  "Arrival Date": form.arrivalDate?.format("YYYY-MM-DD"),
                  "Arrival Port": form.arrivalPort,
                  "Arrival Country": form.arrivalCountry,
                  "Cargo Type": form.cargo.type,
                  "Quantity Unit": form.cargo.quantityUnit,
                  "Total": form.cargo.total,
                  "Rate USD": form.cargo.rateUSD,
                  "Agent": form.agent,
                  "Consignee": form.consignee,
                  "Remarks": form.remarks,
                }).map(([label, value]) => (
                  <Typography key={label} variant="body1" gutterBottom>
                    <strong>{label}:</strong> {value}
                  </Typography>
                ))}

                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              </Box>
            )}
          </DialogContent>

          {editMode && (
            <DialogActions>
              <Button onClick={closeModal} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained">
                Save
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
