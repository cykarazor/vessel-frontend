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
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" color="primary">
          Voyages
        </Typography>
        <Box>
          <Button onClick={onLogout} sx={{ mr: 2 }} color="secondary" variant="outlined">
            Logout
          </Button>
          <Button onClick={handleAddVoyage} variant="contained" color="primary" startIcon={<AddCircleIcon />}>
            Add Voyage
          </Button>
        </Box>
      </Box>

      <Paper variant="outlined">
        <VoyageList voyages={voyages} onSelect={handleViewVoyage} />
      </Paper>

      <VoyageDetails
        open={viewMode}
        selectedVoyage={selectedVoyage}
        closeModal={handleCloseModals}
        onEdit={handleEditFromView}
      />

      <VoyageForm
        open={editMode}
        editMode={!!selectedVoyage}
        form={form}
        selectedVoyage={selectedVoyage}
        onClose={handleCloseModals}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        setEditMode={setEditMode}
      />
    </Box>
  );
}
