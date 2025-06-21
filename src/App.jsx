import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [voyages, setVoyages] = useState([]);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
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

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
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
        <>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {voyages.map((v) => (
              <li
                key={v._id || `${v.vesselName}-${v.voyageNumber}`}
                onClick={() => setSelectedVoyage(v)}
                style={{
                  cursor: "pointer",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{v.voyageNumber || "N/A"}</strong> — {v.vesselName || "N/A"}
              </li>
            ))}
          </ul>

          {/* Modal */}
          {selectedVoyage && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={() => setSelectedVoyage(null)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 24,
                  minWidth: 320,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedVoyage(null)}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    border: "none",
                    background: "transparent",
                    fontSize: 20,
                    cursor: "pointer",
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3>
                  {selectedVoyage.vesselName} – Voyage #{selectedVoyage.voyageNumber}
                </h3>
                <p>
                  <strong>From:</strong> {selectedVoyage.departurePort} on{" "}
                  {selectedVoyage.departureDate}
                </p>
                <p>
                  <strong>To:</strong> {selectedVoyage.arrivalPort} on{" "}
                  {selectedVoyage.arrivalDate}
                </p>
                <p>
                  <strong>Cargo:</strong> {selectedVoyage.cargo?.type} –{" "}
                  {selectedVoyage.cargo?.total} {selectedVoyage.cargo?.quantityUnit} @ $
                  {selectedVoyage.cargo?.rateUSD}
                </p>
                {selectedVoyage.remarks && (
                  <p>
                    <strong>Remarks:</strong> {selectedVoyage.remarks}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
