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
  DatePicker,
  LocalizationProvider,
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

  const handleDateChange = (name, date) => {
    setForm((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      departureDate: form.departureDate ? dayjs(form.departureDate).toISOString() : null,
      arrivalDate: form.arrivalDate ? dayjs(form.arrivalDate).toISOString() : null,
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
      <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
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

        <Dialog open={!!selectedVoyage} onClose={closeModal} maxWidth="md" fullWidth>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Vessel Name"
                      name="vesselName"
                      value={form.vesselName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Voyage Number"
                      name="voyageNumber"
                      value={form.voyageNumber}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Departure Group */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Departure</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      label="Departure Date"
                      value={form.departureDate}
                      onChange={(date) => handleDateChange("departureDate", date)}
                      renderInput={(params) => (
                        <TextField fullWidth required {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="Departure Port"
                      name="departurePort"
                      value={form.departurePort}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                    <Typography variant="subtitle1">Arrival</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      label="Arrival Date"
                      value={form.arrivalDate}
                      onChange={(date) => handleDateChange("arrivalDate", date)}
                      renderInput={(params) => (
                        <TextField fullWidth required {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="Arrival Port"
                      name="arrivalPort"
                      value={form.arrivalPort}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Arrival Country"
                      name="arrivalCountry"
                      value={form.arrivalCountry}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Cargo Section */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }} variant="outlined">
                      <Typography variant="subtitle1" gutterBottom>
                        Cargo Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Cargo Type"
                            name="cargo.type"
                            value={form.cargo.type}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TextField
                            select
                            fullWidth
                            label="Unit"
                            name="cargo.quantityUnit"
                            value={form.cargo.quantityUnit}
                            onChange={handleChange}
                            SelectProps={{ native: true }}
                          >
                            <option value="MT">MT</option>
                            <option value="KG">KG</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Total"
                            name="cargo.total"
                            value={form.cargo.total}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Rate USD"
                            name="cargo.rateUSD"
                            value={form.cargo.rateUSD}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agent"
                      name="agent"
                      value={form.agent}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Consignee"
                      name="consignee"
                      value={form.consignee}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Typography>Display view goes here (if needed)</Typography>
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
