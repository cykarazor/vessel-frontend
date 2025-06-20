import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [voyages, setVoyages] = useState([]);
  const [form, setForm] = useState({
    vesselName: "",
    voyageNumber: "",
    departureDate: "",
    departurePort: "",
    arrivalDate: "",
    arrivalPort: "",
    cargo: { type: "", quantityUnit: "MT", total: "", rateUSD: "" },
    remarks: "",
  });

  useEffect(() => {
    fetchVoyages();
  }, []);

  async function fetchVoyages() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/voyages`);
      setVoyages(res.data);
    } catch (error) {
      console.error("Error fetching voyages:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("cargo.")) {
      setForm((prev) => ({
        ...prev,
        cargo: { ...prev.cargo, [name.split(".")[1]]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/voyages`, form);
      setForm({
        vesselName: "",
        voyageNumber: "",
        departureDate: "",
        departurePort: "",
        arrivalDate: "",
        arrivalPort: "",
        cargo: { type: "", quantityUnit: "MT", total: "", rateUSD: "" },
        remarks: "",
      });
      fetchVoyages();
    } catch (error) {
      console.error("Error adding voyage:", error);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Vessel Voyage Tracker</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          name="vesselName"
          placeholder="Vessel Name"
          value={form.vesselName}
          onChange={handleChange}
          required
        />
        <input
          name="voyageNumber"
          placeholder="Voyage Number"
          value={form.voyageNumber}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="departureDate"
          value={form.departureDate}
          onChange={handleChange}
          required
        />
        <input
          name="departurePort"
          placeholder="Departure Port"
          value={form.departurePort}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="arrivalDate"
          value={form.arrivalDate}
          onChange={handleChange}
          required
        />
        <input
          name="arrivalPort"
          placeholder="Arrival Port"
          value={form.arrivalPort}
          onChange={handleChange}
          required
        />
        <input
          name="cargo.type"
          placeholder="Cargo Type"
          value={form.cargo.type}
          onChange={handleChange}
          required
        />
        <select
          name="cargo.quantityUnit"
          value={form.cargo.quantityUnit}
          onChange={handleChange}
          required
        >
          <option value="MT">MT</option>
          <option value="KG">KG</option>
        </select>
        <input
          name="cargo.total"
          placeholder="Total"
          type="number"
          min="0"
          step="any"
          value={form.cargo.total}
          onChange={handleChange}
          required
        />
        <input
          name="cargo.rateUSD"
          placeholder="Rate in USD"
          type="number"
          min="0"
          step="any"
          value={form.cargo.rateUSD}
          onChange={handleChange}
          required
        />
        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />
        <button type="submit" style={{ marginTop: 10 }}>
          Add Voyage
        </button>
      </form>

      <h3 style={{ marginTop: 30 }}>Voyages</h3>
      {voyages.length === 0 ? (
        <p>No voyages yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {voyages.map((v) => (
            <div
              key={v._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                background: "#f9f9f9",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0" }}>
                {v.vesselName} – Voyage #{v.voyageNumber}
              </h4>
              <p style={{ margin: "4px 0" }}>
                <strong>From:</strong> {v.departurePort} on {v.departureDate}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>To:</strong> {v.arrivalPort} on {v.arrivalDate}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Cargo:</strong> {v.cargo.type} – {v.cargo.total} {v.cargo.quantityUnit} @ ${v.cargo.rateUSD}
              </p>
              {v.remarks && (
                <p style={{ margin: "4px 0" }}>
                  <strong>Remarks:</strong> {v.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
