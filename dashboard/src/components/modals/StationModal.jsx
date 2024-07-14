import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';
const StationModal = ({ open, setOpen, handleState }) => {
    const handleClose = () => setOpen(false);



  const modalWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  
  const company_id = getCompanyID();


  const [newStation, setNewStation] = useState({
    name:"",
    longitude:0.0,
    latitude:1.1,
    company: company_id,
  }) ;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStation((prevCode) => ({
      ...prevCode,
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
    <div style={modalWrapperStyle}>
      <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
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
            style={{ marginBottom: '10px' }}
          />
          
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Sauvegarder
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Anuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StationModal
