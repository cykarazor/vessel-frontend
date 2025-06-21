import React, { useEffect, useState } from "react";
import axios from "axios";

// Simple modal component with improved overlay
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.45)", // darker overlay
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 8, minWidth: 340, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 4px 32px rgba(0,0,0,0.20)"
      }}>
        <button style={{ float: "right", fontSize: 24, background: "none", border: "none", cursor: "pointer" }} onClick={onClose}>&times;</button>
        <div style={{ clear: "both" }} />
        {children}
      </div>
    </div>
  );
}

const initialForm = {
  vesselName: "",
  voyageNumber: "",
  departureDate: "",
  departurePort: "",
  departureCountry: "",
  arrivalDate: "",
  arrivalPort: "",
  arrivalCountry: "",
  cargo: {
    type: "",
    quantityUnit: "MT",
    total: "",
    rateUSD: ""
  },
  agent: "",
  consignee: "",
  remarks: ""
};

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);

  // Fetch voyages
  const fetchVoyages = async () => {
    const res = await axios.get(`${API_BASE}/api/voyages`);
    setVoyages(res.data);
  };

  useEffect(() => {
    fetchVoyages();
  }, []);

  // Handle form changes
  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith("cargo.")) {
      const key = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        cargo: { ...prev.cargo, [key]: value }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submit (edit in modal)
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedVoyage && selectedVoyage._id) {
        await axios.put(`${API_BASE}/api/voyages/${selectedVoyage._id}`, form);
      } else {
        await axios.post(`${API_BASE}/api/voyages`, form);
      }
      setEditMode(false);
      setSelectedVoyage(null);
      setForm(initialForm);
      fetchVoyages();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving voyage");
    }
  };

  // Open modal for viewing
  const openModal = (voyage) => {
    setSelectedVoyage(voyage);
    setEditMode(false);
    setForm({
      vesselName: voyage.vesselName || "",
      voyageNumber: voyage.voyageNumber || "",
      departureDate: voyage.departureDate ? voyage.departureDate.slice(0, 10) : "",
      departurePort: voyage.departurePort || "",
      departureCountry: voyage.departureCountry || "",
      arrivalDate: voyage.arrivalDate ? voyage.arrivalDate.slice(0, 10) : "",
      arrivalPort: voyage.arrivalPort || "",
      arrivalCountry: voyage.arrivalCountry || "",
      cargo: {
        type: voyage.cargo?.type || "",
        quantityUnit: voyage.cargo?.quantityUnit || "MT",
        total: voyage.cargo?.total || "",
        rateUSD: voyage.cargo?.rateUSD || ""
      },
      agent: voyage.agent || "",
      consignee: voyage.consignee || "",
      remarks: voyage.remarks || ""
    });
  };

  // Open modal in edit mode for adding new voyage
  const openAddModal = () => {
    setSelectedVoyage({}); // Empty object, no _id
    setEditMode(true);
    setForm(initialForm);
  };

  // Close modal
  const closeModal = () => {
    setSelectedVoyage(null);
    setEditMode(false);
    setForm(initialForm);
  };

  return (
    <div style={{
      maxWidth: 1100,
      margin: "2rem auto",
      fontFamily: "sans-serif",
      background: "#f5f6fa", // very light gray
      minHeight: "100vh",
      padding: "2rem",
      borderRadius: 10
    }}>
      <h1 style={{ color: "#273c75" }}>Voyages</h1>
      <button style={{ marginBottom: 12, background: "#273c75", color: "#fff", padding: "8px 14px", border: "none", borderRadius: 5, cursor: "pointer" }} onClick={openAddModal}>Add Voyage</button>
      <table border="0" cellPadding={6} cellSpacing={0} style={{ width: "100%", background: "#fff", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <thead style={{ background: "#273c75", color: "#fff" }}>
          <tr>
            <th>Vessel Name</th>
            <th>Voyage #</th>
            <th>Departure</th>
            <th>Departure Country</th>
            <th>Arrival</th>
            <th>Arrival Country</th>
            <th>Cargo</th>
            <th>Agent</th>
            <th>Consignee</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {voyages.map((v, idx) => (
            <tr
              key={v._id}
              style={{
                cursor: "pointer",
                background: idx % 2 === 0 ? "#fff" : "#f3f7fa"
              }}
              onClick={() => openModal(v)}
            >
              <td>{v.vesselName}</td>
              <td>{v.voyageNumber}</td>
              <td>
                {v.departurePort}<br />
                {v.departureDate ? new Date(v.departureDate).toLocaleDateString() : ""}
              </td>
              <td>{v.departureCountry}</td>
              <td>
                {v.arrivalPort}<br />
                {v.arrivalDate ? new Date(v.arrivalDate).toLocaleDateString() : ""}
              </td>
              <td>{v.arrivalCountry}</td>
              <td>
                {v.cargo?.type} <br />
                {v.cargo?.total} {v.cargo?.quantityUnit} <br />
                USD {v.cargo?.rateUSD}
              </td>
              <td>{v.agent}</td>
              <td>{v.consignee}</td>
              <td>{v.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for view/edit/add */}
      <Modal open={!!selectedVoyage} onClose={closeModal}>
        {editMode ? (
          <form onSubmit={handleSubmit}>
