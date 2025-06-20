import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [voyages, setVoyages] = useState([]);
  const [form, setForm] = useState({
    vesselName: '', voyageNumber: '', departureDate: '',
    departurePort: '', arrivalDate: '', arrivalPort: '',
    cargo: { type: '', quantityUnit: 'MT', total: '', rateUSD: '' },
    remarks: ''
  });

  useEffect(() => {
    axios.get('/api/voyages').then(res => setVoyages(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('cargo.')) {
      setForm({ ...form, cargo: { ...form.cargo, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/voyages', form);
    const res = await axios.get('/api/voyages');
    setVoyages(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vessel Voyage Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required />
        <input name="voyageNumber" placeholder="Voyage Number" onChange={handleChange} required />
        <input type="date" name="departureDate" onChange={handleChange} required />
        <input name="departurePort" placeholder="Departure Port" onChange={handleChange} required />
        <input type="date" name="arrivalDate" onChange={handleChange} required />
        <input name="arrivalPort" placeholder="Arrival Port" onChange={handleChange} required />
        <input name="cargo.type" placeholder="Cargo Type" onChange={handleChange} required />
        <select name="cargo.quantityUnit" onChange={handleChange}>
          <option value="MT">MT</option>
          <option value="KG">KG</option>
        </select>
        <input name="cargo.total" placeholder="Total" onChange={handleChange} required />
        <input name="cargo.rateUSD" placeholder="Rate USD" onChange={handleChange} required />
        <input name="remarks" placeholder="Remarks" onChange={handleChange} />
        <button type="submit">Add Voyage</button>
      </form>
      <h3>Voyages</h3>
      <ul>
        {voyages.map((v, i) => (
          <li key={i}>{v.vesselName} - {v.voyageNumber}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
