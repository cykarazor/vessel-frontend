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
  Alert,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
  // Auth state
  const [user, setUser] = useState(null);

  // Register/Login form states
  const [authMode, setAuthMode] = useState("login"); // or "register"
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  // Voyage states
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);

  // On mount: check token and load user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchVoyages();
    }
  }, []);

  // Fetch voyages only if logged in
  const fetchVoyages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/voyages`);
      setVoyages(res.data);
    } catch {
      // ignore or handle fetch errors
    }
  };

  // Auth form input handler
  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
    setAuthError("");
    setAuthMessage("");
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        username: authForm.username,
        email: authForm.email,
        password: authForm.password,
      });
      setAuthMessage(res.data.message || "Registered successfully! Please login.");
      setAuthError("");
      setAuthForm({ username: "", email: "", password: "" });
      setAuthMode("login");
    } catch (err) {
      setAuthError(err.response?.data?.error || "Registration failed");
      setAuthMessage("");
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setAuthError("");
      setAuthMessage("");
      setAuthForm({ username: "", email: "", password: "" });
      fetchVoyages();
    } catch (err) {
      setAuthError(err.response?.data?.error || "Login failed");
      setAuthMessage("");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setVoyages([]);
  };

  // Voyage form handlers

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
    try {
      if (selectedVoyage && selectedVoyage._id) {
        await axios.put(`${API_BASE}/api/voyages/${selectedVoyage._id}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/voyages`, payload);
      }
      setEditMode(false);
      setSelectedVoyage(null);
      setForm(initialForm);
      fetchVoyages();
    } catch (error) {
      alert("Error saving voyage: " + error.message);
    }
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

  // JSX for auth forms
  const renderAuthForm = () => {
    if (authMode === "register") {
      return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
          <Typography variant="h5" mb={2}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Username"
                name="username"
                value={authForm.username}
                onChange={handleAuthChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                required
              />
              <Button type="submit" variant="contained">
                Register
              </Button>
              {authError && <Alert severity="error">{authError}</Alert>}
              {authMessage && <Alert severity="success">{authMessage}</Alert>}
              <Button
                color="primary"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setAuthMessage("");
                  setAuthForm({ username: "", email: "", password: "" });
                }}
              >
                Already have an account? Login
              </Button>
            </Stack>
          </Box>
        </Box>
      );
    } else {
      // login mode
      return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
          <Typography variant="h5" mb={2}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                required
              />
              <Button type="submit" variant="contained">
                Login
              </Button>
              {authError && <Alert severity="error">{authError}</Alert>}
              <Button
                color="primary"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                  setAuthMessage("");
                  setAuthForm({ username: "", email: "", password: "" });
                }}
              >
                Don't have an account? Register
              </Button>
            </Stack>
          </Box>
        </Box>
      );
    }
  };

  if (!user) {
    // Not logged in — show auth forms
    return renderAuthForm();
  }

  // Logged in — show voyages UI with logout button
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
          <Box>
            <Button
              onClick={handleLogout}
              sx={{ mr: 2 }}
              color="secondary"
              variant="outlined"
            >
              Logout
            </Button>
            <Button
              onClick={openAddModal}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
            >
              Add Voyage
            </Button>
          </Box>
        </Box>

        {/* Voyages List */}
        <Paper variant="outlined">
          <List>
            {voyages.map((voyage) => (
              <Box key={voyage._id}>
                <ListItemText
                  primary={
                    <Typography
                      onClick={() => openModal(voyage)}
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {voyage.vesselName} - {voyage.voyageNumber}
                    </Typography>
                  }
                  secondary={
                    voyage.departurePort && voyage.arrivalPort
                      ? `${voyage.departurePort} → ${voyage.arrivalPort}`
                      : null
                  }
                />
              </Box>
            ))}
          </List>
        </Paper>

        {/* Modal for Add / View / Edit Voyage */}
        <Dialog
  open={Boolean(selectedVoyage)}
  onClose={closeModal}
  maxWidth="md"
  fullWidth
  PaperProps={{ sx: { borderRadius: 3 } }}
>
  <DialogTitle
    sx={{
      fontWeight: 600,
      fontSize: "1.5rem",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #ddd",
      pr: 5,
    }}
  >
    {editMode
      ? selectedVoyage?._id
        ? "Edit Voyage"
        : "Add Voyage"
      : "Voyage Details"}
    <IconButton
      aria-label="close"
      onClick={closeModal}
      sx={{
        position: "absolute",
        right: 16,
        top: 16,
        color: (theme) => theme.palette.grey[600],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ backgroundColor: "#fafafa", px: 3, py: 2 }}>
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* --- VESSEL INFO --- */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Vessel Information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Vessel Name"
            name="vesselName"
            value={form.vesselName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Voyage Number"
            name="voyageNumber"
            value={form.voyageNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>

        {/* --- DEPARTURE INFO --- */}
        <Grid item xs={12} mt={2}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Departure
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Departure Date"
            value={form.departureDate}
            onChange={(date) => handleDateChange("departureDate", date)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: { backgroundColor: "#fff", borderRadius: 1 },
              },
            }}
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Departure Port"
            name="departurePort"
            value={form.departurePort}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Departure Country"
            name="departureCountry"
            value={form.departureCountry}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>

        {/* --- ARRIVAL INFO --- */}
        <Grid item xs={12} mt={2}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Arrival
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Arrival Date"
            value={form.arrivalDate}
            onChange={(date) => handleDateChange("arrivalDate", date)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: { backgroundColor: "#fff", borderRadius: 1 },
              },
            }}
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Arrival Port"
            name="arrivalPort"
            value={form.arrivalPort}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Arrival Country"
            name="arrivalCountry"
            value={form.arrivalCountry}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>

        {/* --- CARGO INFO --- */}
        <Grid item xs={12} mt={2}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Cargo
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Cargo Type"
            name="cargo.type"
            value={form.cargo.type}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Unit"
            name="cargo.quantityUnit"
            value={form.cargo.quantityUnit}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Total"
            name="cargo.total"
            value={form.cargo.total}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Rate (USD)"
            name="cargo.rateUSD"
            value={form.cargo.rateUSD}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>

        {/* --- AGENT / CONSIGNEE --- */}
        <Grid item xs={12} mt={2}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Agent & Consignee
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Agent"
            name="agent"
            value={form.agent}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Consignee"
            name="consignee"
            value={form.consignee}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>

        {/* --- REMARKS --- */}
        <Grid item xs={12}>
          <TextField
            label="Remarks"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            disabled={!editMode}
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
        </Grid>
      </Grid>
    </Box>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      py: 2,
      backgroundColor: "#f5f5f5",
      borderTop: "1px solid #ddd",
    }}
  >
    {editMode ? (
      <>
        <Button
          onClick={closeModal}
          variant="outlined"
          color="secondary"
          sx={{ fontWeight: 500 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Save
        </Button>
      </>
    ) : (
      <Button
        onClick={() => setEditMode(true)}
        variant="contained"
        startIcon={<EditIcon />}
        sx={{ fontWeight: 600 }}
      >
        Edit
      </Button>
    )}
  </DialogActions>
</Dialog>

      </Box>
    </LocalizationProvider>
  );
}

export default App;
