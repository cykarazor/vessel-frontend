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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Voyage Info</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Voyage Number" value={form.voyageNumber} disabled />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Vessel Name" value={form.vesselName} disabled />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Departure Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Departure Port" value={form.departurePort} disabled />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Departure Country" value={form.departureCountry} disabled />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Departure Date" value={form.departureDate?.format("YYYY-MM-DD") || ""} disabled />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Arrival Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Arrival Port" value={form.arrivalPort} disabled />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Arrival Country" value={form.arrivalCountry} disabled />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Arrival Date" value={form.arrivalDate?.format("YYYY-MM-DD") || ""} disabled />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Cargo Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Type" value={form.cargo.type} disabled />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Unit" value={form.cargo.quantityUnit} disabled />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Total" value={form.cargo.total} disabled />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Rate (USD)" value={form.cargo.rateUSD} disabled />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Agent & Consignee</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Agent" value={form.agent} disabled />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Consignee" value={form.consignee} disabled />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Remarks</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      maxRows={8}
                      label="Remarks"
                      value={form.remarks}
                      disabled
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
