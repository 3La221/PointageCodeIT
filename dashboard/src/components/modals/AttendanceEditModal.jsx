import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { MenuItem, TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';

const AttendanceEditModal = ({ open, setOpen, codes, date, employeId,handleState }) => {
  const handleClose = () => setOpen(false);
  const company_id = getCompanyID();

  const modalWrapperStyle = {
    display: open ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };


  const [codeID, setCodeID] = useState('');

  const handleSubmit = () => {
    axiosService
      .post(`employe/${employeId}/change_code/`, { date: date, code_id: codeID })
      .then((res) => {
        console.log(res.data);
        handleClose();
        handleState()


      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={modalWrapperStyle}>
      <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Modal.Header>
          <Modal.Title>Modifier le code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="outlined-select"
            select
            label="Sélectionner Code"
            helperText="Veuillez sélectionner le code"
            onChange={(e) => { setCodeID(e.target.value) }}
            fullWidth
            style={{ marginBottom: '10px', marginTop: '10px' }}
          >
            {codes.map((code) => (
              <MenuItem key={code.id} value={code.id} >
                {code.name}
              </MenuItem>
            ))}
          </TextField>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary" >
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

export default AttendanceEditModal;
