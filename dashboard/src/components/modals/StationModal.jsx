import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';
import axiosService from '../../helpers/axios';

const StationModal = ({ open, setOpen, handleState }) => {
  const [newStation, setNewStation] = useState({
    name: "",
    longitude: 0.0,
    latitude: 0.0,
    company: getCompanyID(),
  });

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStation((prevStation) => ({
      ...prevStation,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axiosService
      .post('station/', newStation)
      .then((res) => {
        console.log(res);
        handleClose();
        handleState();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ display: open ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>Ajouter une Station</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="name"
            name="name"
            label="Nom"
            variant="outlined"
            value={newStation.name}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px', marginTop: '10px' }}
          />
          <TextField
            id="longitude"
            name="longitude"
            label="Longitude"
            variant="outlined"
            value={newStation.longitude}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px', marginTop: '10px' }}
            type='number'
          />
          <TextField
            id="latitude"
            name="latitude"
            label="Latitude"
            variant="outlined"
            value={newStation.latitude}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px', marginTop: '10px' }}
            type='number'
          />
          <div style={{ height: '300px', width: '100%' }}>
            <MapContainer center={[newStation.latitude, newStation.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[newStation.latitude, newStation.longitude]}>
                <Popup>
                  {newStation.name}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Sauvegarder
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StationModal;
