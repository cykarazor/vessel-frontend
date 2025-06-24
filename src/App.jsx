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
  Card,
  CardContent,
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" color="primary">Voyages</Typography>
          <Button variant="contained" startIcon={<AddCircleIcon />} onClick={openAddModal}>
            Add Voyage
          </Button>
        </Box>

        <List>
          {voyages.map((v) => (
            <Paper key={v._id} elevation={2} sx={{ mb: 1, cursor: "pointer", p: 2, "&:hover": { bgcolor: "action.hover" } }} onClick={() => openModal(v)}>
              <ListItemText
                primary={<Typography variant="h6">{v.vesselName}</Typography>}
                secondary={`Voyage #${v.voyageNumber}`}
              />
            </Paper>
          ))}
        </List>

        <Dialog open={!!selectedVoyage} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {editMode ? (selectedVoyage._id ? "Edit Voyage" : "Add Voyage") : "Voyage Details"}
            <IconButton onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {editMode ? (
              <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mt: 1 }}>
                <Grid container spacing={2}>

                  {/* Voyage Info */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Voyage Info</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="voyageNumber"
                              label="Voyage Number"
                              value={form.voyageNumber}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="vesselName"
                              label="Vessel Name"
                              value={form.vesselName}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Departure Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Departure Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              name="departurePort"
                              label="Departure Port"
                              value={form.departurePort}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              name="departureCountry"
                              label="Departure Country"
                              value={form.departureCountry}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <DatePicker
                              label="Departure Date"
                              value={form.departureDate}
                              onChange={(date) => handleDateChange("departureDate", date)}
                              slotProps={{ textField: { fullWidth: true, required: true } }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Arrival Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Arrival Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              name="arrivalPort"
                              label="Arrival Port"
                              value={form.arrivalPort}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              name="arrivalCountry"
                              label="Arrival Country"
                              value={form.arrivalCountry}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <DatePicker
                              label="Arrival Date"
                              value={form.arrivalDate}
                              onChange={(date) => handleDateChange("arrivalDate", date)}
                              slotProps={{ textField: { fullWidth: true, required: true } }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Cargo Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Cargo Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              name="cargo.type"
                              label="Type"
                              value={form.cargo.type}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              select
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
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Total"
                              name="cargo.total"
                              value={form.cargo.total}
                              onChange={handleChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Rate (USD)"
                              name="cargo.rateUSD"
                              value={form.cargo.rateUSD}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Agent & Consignee */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Agent & Consignee</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              name="agent"
                              label="Agent"
                              value={form.agent}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              name="consignee"
                              label="Consignee"
                              value={form.consignee}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Remarks</Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          maxRows={8}
                          name="remarks"
                          label="Remarks"
                          value={form.remarks}
                          onChange={handleChange}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>

                  {/* Voyage Info */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Voyage Info</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography><strong>Voyage Number:</strong> {form.voyageNumber}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography><strong>Vessel Name:</strong> {form.vesselName}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Departure Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Departure Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Departure Port:</strong> {form.departurePort}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Departure Country:</strong> {form.departureCountry}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Departure Date:</strong> {form.departureDate ? form.departureDate.format("YYYY-MM-DD") : ""}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Arrival Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Arrival Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Arrival Port:</strong> {form.arrivalPort}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Arrival Country:</strong> {form.arrivalCountry}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography><strong>Arrival Date:</strong> {form.arrivalDate ? form.arrivalDate.format("YYYY-MM-DD") : ""}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Cargo Details */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Cargo Details</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <Typography><strong>Type:</strong> {form.cargo.type}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography><strong>Unit:</strong> {form.cargo.quantityUnit}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography><strong>Total:</strong> {form.cargo.total}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography><strong>Rate (USD):</strong> {form.cargo.rateUSD}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Agent & Consignee */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Agent & Consignee</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography><strong>Agent:</strong> {form.agent}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography><strong>Consignee:</strong> {form.consignee}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Remarks</Typography>
                        <Typography sx={{ whiteSpace: "pre-line" }}>{form.remarks}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                </Box>
              </>
            )}
          </DialogContent>

          {editMode && (
            <DialogActions>
              <Button onClick={closeModal} color="inherit">Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" type="submit">Save</Button>
            </DialogActions>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
