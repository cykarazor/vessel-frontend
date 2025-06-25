import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export default function VoyagesPage() {
  const { token, logout } = useContext(AuthContext);
  const [voyages, setVoyages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editVoyage, setEditVoyage] = useState(null);
  const [form, setForm] = useState({
    vesselName: '',
    voyageNumber: '',
    departurePort: '',
    arrivalPort: '',
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchVoyages();
  }, [token]);

  const fetchVoyages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/voyages`);
      setVoyages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openAddModal = () => {
    setEditVoyage(null);
    setForm({ vesselName: '', voyageNumber: '', departurePort: '', arrivalPort: '' });
    setOpen(true);
  };

  const openEditModal = (voyage) => {
    setEditVoyage(voyage);
    setForm({
      vesselName: voyage.vesselName || '',
      voyageNumber: voyage.voyageNumber || '',
      departurePort: voyage.departurePort || '',
      arrivalPort: voyage.arrivalPort || '',
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditVoyage(null);
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editVoyage) {
        await axios.put(`${API_BASE}/api/voyages/${editVoyage._id}`, form);
      } else {
        await axios.post(`${API_BASE}/api/voyages`, form);
      }
      fetchVoyages();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Voyages</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={openAddModal}
          sx={{ mr: 2 }}
        >
          Add Voyage
        </Button>
        <Button color="error" onClick={logout}>
          Logout
        </Button>
      </Stack>

      <Paper variant="outlined">
        <List>
          {voyages.length === 0 ? (
            <Typography textAlign="center" p={3}>
              No voyages available.
            </Typography>
          ) : (
            voyages.map((voyage) => (
              <ListItemButton key={voyage._id} onClick={() => openEditModal(voyage)}>
                {voyage.vesselName} - Voyage #{voyage.voyageNumber}
              </ListItemButton>
            ))
          )}
        </List>
      </Paper>

      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editVoyage ? 'Edit Voyage' : 'Add Voyage'}
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Vessel Name"
              name="vesselName"
              value={form.vesselName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Voyage Number"
              name="voyageNumber"
              value={form.voyageNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Departure Port"
              name="departurePort"
              value={form.departurePort}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Arrival Port"
              name="arrivalPort"
              value={form.arrivalPort}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
