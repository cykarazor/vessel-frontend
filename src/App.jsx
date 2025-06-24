import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Pencil } from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl">&times;</button>
        {children}
      </div>
    </div>
  );
}

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
      setForm((prev) => ({ ...prev, cargo: { ...prev.cargo, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVoyage && selectedVoyage._id) {
      await axios.put(`${API_BASE}/api/voyages/${selectedVoyage._id}`, form);
    } else {
      await axios.post(`${API_BASE}/api/voyages`, form);
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
      departureDate: voyage.departureDate?.slice(0, 10) || "",
      departurePort: voyage.departurePort || "",
      departureCountry: voyage.departureCountry || "",
      arrivalDate: voyage.arrivalDate?.slice(0, 10) || "",
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">Voyages</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <PlusCircle size={20} /> Add Voyage
        </button>
      </div>
      <div className="grid gap-4">
        {voyages.map((v) => (
          <div
            key={v._id}
            onClick={() => openModal(v)}
            className="bg-white rounded-lg p-4 shadow hover:bg-blue-50 cursor-pointer"
          >
            <div className="text-lg font-semibold">{v.vesselName}</div>
            <div className="text-sm text-gray-600">Voyage #{v.voyageNumber}</div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedVoyage} onClose={closeModal}>
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700">{selectedVoyage._id ? "Edit" : "Add"} Voyage</h2>
            {Object.entries(initialForm).map(([key, val]) => {
              if (key === "cargo") return (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <input name="cargo.type" value={form.cargo.type} onChange={handleChange} placeholder="Cargo Type" className="border p-2 rounded" />
                  <input name="cargo.total" value={form.cargo.total} onChange={handleChange} placeholder="Total" className="border p-2 rounded" />
                  <input name="cargo.rateUSD" value={form.cargo.rateUSD} onChange={handleChange} placeholder="Rate USD" className="border p-2 rounded" />
                  <select name="cargo.quantityUnit" value={form.cargo.quantityUnit} onChange={handleChange} className="border p-2 rounded">
                    <option value="MT">MT</option>
                    <option value="KG">KG</option>
                  </select>
                </div>
              );
              return (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  className="w-full border p-2 rounded"
                />
              );
            })}
            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Voyage Details</h2>
            {Object.entries(form).map(([key, val]) => (
              key === "cargo" ? (
                <div key={key} className="text-sm text-gray-700">
                  <p><strong>Cargo Type:</strong> {val.type}</p>
                  <p><strong>Quantity Unit:</strong> {val.quantityUnit}</p>
                  <p><strong>Total:</strong> {val.total}</p>
                  <p><strong>Rate USD:</strong> {val.rateUSD}</p>
                </div>
              ) : (
                <p key={key} className="text-sm text-gray-700"><strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {val}</p>
              )
            ))}
            <button onClick={() => setEditMode(true)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <Pencil size={16} /> Edit
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
