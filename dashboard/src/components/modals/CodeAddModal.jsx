import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';

const CodeAddModal = ({ open, setOpen, handleState }) => {
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const handleColorChange = (e) => {
    setNewCode((prevCode) => ({
      ...prevCode,
      color: e.target.value, // Directly set the color value
    }));
  };

  const company_id = getCompanyID();
  const [newCode, setNewCode] = useState({
    name: '',
    meaning: '',
    color: '#000000',
    role: 'OTHER',
    company: company_id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCode((prevCode) => ({
      ...prevCode,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(newCode);

    axiosService
      .post('code/', newCode)
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
          <Modal.Title>Ajouter un nouveau code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="name"
            name="name"
            label="Nom"
            variant="outlined"
            value={newCode.name}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            id="meaning"
            name="meaning"
            label="Signification"
            variant="outlined"
            value={newCode.meaning}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <input
            id="color"
            name="color"
            type="color"
            value={newCode.color}
            onChange={handleColorChange}
            style={{ marginBottom: '10px', width: '100%', height: '56px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Enregistrer
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CodeAddModal;
