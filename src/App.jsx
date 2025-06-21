import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

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

  // Handle form submit (add or edit)
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE}/api/voyages/${editId}`, form);
      } else {
        await axios.post(`${API_BASE}/api/voyages`, form);
      }
      setForm(initialForm);
      setEditId(null);
      fetchVoyages();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving voyage");
    }
  };

  // Populate form for editing
  const handleEdit = voyage => {
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
    setEditId(voyage._id);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setForm(initialForm);
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Voyages</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, border: "1px solid #ddd", padding: 16, borderRadius: 6 }}>
        <h2>{editId ? "Edit Voyage" : "Add Voyage"}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div>
            <label>Vessel Name<br />
              <input name="vesselName" value={form.vesselName} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Voyage Number<br />
              <input name="voyageNumber" value={form.voyageNumber} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Departure Date<br />
              <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Departure Port<br />
              <input name="departurePort" value={form.departurePort} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Departure Country<br />
              <input name="departureCountry" value={form.departureCountry} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Arrival Date<br />
              <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Arrival Port<br />
              <input name="arrivalPort" value={form.arrivalPort} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Arrival Country<br />
              <input name="arrivalCountry" value={form.arrivalCountry} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Cargo Type<br />
              <input name="cargo.type" value={form.cargo.type} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Quantity Unit<br />
              <select name="cargo.quantityUnit" value={form.cargo.quantityUnit} onChange={handleChange}>
                <option value="MT">MT</option>
                <option value="KG">KG</option>
              </select>
            </label>
          </div>
          <div>
            <label>Total<br />
              <input type="number" name="cargo.total" value={form.cargo.total} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Rate USD<br />
              <input type="number" name="cargo.rateUSD" value={form.cargo.rateUSD} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Agent<br />
              <input name="agent" value={form.agent} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Consignee<br />
              <input name="consignee" value={form.consignee} onChange={handleChange} />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label>Remarks<br />
              <input name="remarks" value={form.remarks} onChange={handleChange} />
            </label>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && (
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <table border="1" cellPadding={6} cellSpacing={0} style={{ width: "100%", background: "#fff" }}>
        <thead>
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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {voyages.map(v => (
            <tr key={v._id}>
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
              <td>
                <button onClick={() => handleEdit(v)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
