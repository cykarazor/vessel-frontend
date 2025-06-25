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
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={openAddModal}
            >
              Add Voyage
            </Button>
          </Box>
        </Box>

        {/* Voyages list */}
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
                primary={<Typography variant="h6">{v.vesselName}</Typography>}
                secondary={`Voyage #${v.voyageNumber}`}
              />
            </Paper>
          ))}
        </List>

        {/* Voyage details dialog */}
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
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                sx={{ mt: 1 }}
              >
                {/* FULL Voyage Edit Form JSX */}
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
                          minRows={2}
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
                {/* FULL Voyage Details JSX */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Voyage Number</Typography>
                    <Typography variant="body1">{selectedVoyage?.voyageNumber || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Vessel Name</Typography>
                    <Typography variant="body1">{selectedVoyage?.vesselName || "-"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Departure Port</Typography>
                    <Typography variant="body1">{selectedVoyage?.departurePort || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Departure Country</Typography>
                    <Typography variant="body1">{selectedVoyage?.departureCountry || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Departure Date</Typography>
                    <Typography variant="body1">{selectedVoyage?.departureDate ? dayjs(selectedVoyage.departureDate).format("DD MMM YYYY") : "-"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Arrival Port</Typography>
                    <Typography variant="body1">{selectedVoyage?.arrivalPort || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Arrival Country</Typography>
                    <Typography variant="body1">{selectedVoyage?.arrivalCountry || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Arrival Date</Typography>
                    <Typography variant="body1">{selectedVoyage?.arrivalDate ? dayjs(selectedVoyage.arrivalDate).format("DD MMM YYYY") : "-"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">Cargo Type</Typography>
                    <Typography variant="body1">{selectedVoyage?.cargo?.type || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">Quantity Unit</Typography>
                    <Typography variant="body1">{selectedVoyage?.cargo?.quantityUnit || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">Cargo Total</Typography>
                    <Typography variant="body1">{selectedVoyage?.cargo?.total || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">Rate (USD)</Typography>
                    <Typography variant="body1">{selectedVoyage?.cargo?.rateUSD || "-"}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Agent</Typography>
                    <Typography variant="body1">{selectedVoyage?.agent || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Consignee</Typography>
                    <Typography variant="body1">{selectedVoyage?.consignee || "-"}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Remarks</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {selectedVoyage?.remarks || "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </DialogContent>

          {editMode && (
            <DialogActions>
              <Button onClick={closeModal} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained" type="submit">
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
