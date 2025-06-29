import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import VoyageList from "../components/VoyageList";
import VoyageForm from "../components/VoyageForm";
import VoyageDetails from "../components/VoyageDetails";
import {
  Box,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Container,
  Avatar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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

export default function Voyages({ user, onLogout }) {
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    fetchVoyages();
  }, []);

  const fetchVoyages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/voyages`);
      setVoyages(res.data);
    } catch (err) {
      console.error("Error fetching voyages", err);
    }
  };

  const mapToForm = (voyage) => ({
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

  const handleAddVoyage = () => {
    setSelectedVoyage(null);
    setForm(initialForm);
    setEditMode(true);
  };

  const handleViewVoyage = (voyage) => {
    setSelectedVoyage(voyage);
    setForm(mapToForm(voyage));
    setViewMode(true);
  };

  const handleEditFromView = () => {
    setViewMode(false);
    setForm(mapToForm(selectedVoyage));
    setEditMode(true);
  };

  const handleCloseModals = () => {
    setEditMode(false);
    setViewMode(false);
    setSelectedVoyage(null);
    setForm(initialForm);
  };

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
      handleCloseModals();
      fetchVoyages();
    } catch (error) {
      alert("Error saving voyage: " + error.message);
    }
  };

  return (
    <>
      {/* Header with Logo and Username */}
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Simple circle avatar as logo placeholder */}
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              AS
            </Avatar>
            <Typography variant="h6" component="div">
              Atlantic Star Ltd.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Show username */}
            <Typography sx={{ mr: 3 }}>
              Logged in as <strong>{user?.username || "Guest"}</strong>
            </Typography>
            <Button color="inherit" onClick={onLogout} sx={{ mr: 2 }}>
              Logout
            </Button>
            <Button
              onClick={handleAddVoyage}
              color="inherit"
              startIcon={<AddCircleIcon />}
            >
              Add Voyage
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 8 }}>
        {/* Heading over voyage list */}
        <Typography variant="h5" gutterBottom>
          Voyages
        </Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <VoyageList voyages={voyages} onSelect={handleViewVoyage} />
        </Paper>
      </Container>

      {/* Details Modal */}
      <VoyageDetails
        open={viewMode}
        selectedVoyage={selectedVoyage}
        closeModal={handleCloseModals}
        onEdit={handleEditFromView}
      />

      {/* Form Modal */}
      <VoyageForm
        open={editMode}
        isEditing={Boolean(selectedVoyage)}
        form={form}
        selectedVoyage={selectedVoyage}
        onClose={handleCloseModals}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
      />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          backgroundColor: "#f0f0f0",
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Atlantic Star Ltd. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
