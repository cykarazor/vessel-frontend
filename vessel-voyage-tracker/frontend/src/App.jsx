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

  // Fetch voyages from backend
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

  // Handle form input changes
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

  // Submit new voyage
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
      fetchVoyages(); // Refresh the list
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
      <ul>
        {voyages.map((v) => (
          <li key={v._id}>
            <strong>{v.vesselName}</strong> — Voyage #{v.voyageNumber} from{" "}
            {v.departurePort} to {v.arrivalPort} — Cargo: {v.cargo.type} ({v.cargo.total} {v.cargo.quantityUnit}) — Rate: ${v.cargo.rateUSD} — Remarks: {v.remarks}
          </li>
        ))}
      </ul>
    </div>
  );
}
