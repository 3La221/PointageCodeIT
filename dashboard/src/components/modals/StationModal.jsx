import React, { useState } from 'react';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';
import axiosService from '../../helpers/axios';

const StationModal = ({ open, setOpen, handleState }) => {
  
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: open ? 'flex' : 'none',
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

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

  const [newStation, setNewStation] = useState({
    name: "",
    longitude: "",
    latitude: "",
    company: getCompanyID(),
  });

  return (
    <div style={modalWrapperStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        size="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Modal.Header>
          <Modal.Title>Ajouter une station</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            name="name"
            label="Nom de la station"
            value={newStation.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            name="longitude"
            label="Longitude"
            value={newStation.longitude}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
            type='number'

          />
          <TextField
            name="latitude"
            label="Latitude"
            value={newStation.latitude}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
            type='number'
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Valider
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StationModal;
