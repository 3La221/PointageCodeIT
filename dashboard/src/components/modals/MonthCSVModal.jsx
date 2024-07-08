import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button, Stack } from 'rsuite';
import { MenuItem, TextField } from '@mui/material';
import { DOMAIN_URL, getCompanyID } from '../../helpers/actions';

const MonthCSVModal = ({ open, setOpen, handleState, employes }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentEmployeID, setCurrentEmployeID] = useState('');

  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const company_id = getCompanyID();

  const handleSubmit = () => {
    axiosService
      .post(`employe/${currentEmployeID}/one_month_pointings_to_csv/`, { first_date: startDate, last_date: endDate })
      .then((res) => {
        const downloadURL = DOMAIN_URL + res.data.file_url;
        window.location.href = downloadURL;
      })
      .catch((error) => {
        console.error('Error downloading CSV:', error);
      });
  };

  return (
    <div style={modalWrapperStyle}>
      <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Modal.Header>
          <Modal.Title>Sélectionnez la date de début et la date de fin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction='column' spacing={16} style={{ marginTop: "20px" }}>
            <TextField
              id="outlined-select-currency"
              select
              label="Sélectionnez l'employé"
              defaultValue=""
              helperText="Sélectionnez l'employé"
              onChange={(e) => { setCurrentEmployeID(e.target.value) }}
            >
              {
                employes.map((employe) => (
                  <MenuItem key={employe.id} value={employe.id}>
                    {employe.first_name} {employe.last_name}
                  </MenuItem>
                ))
              }
            </TextField>
            <TextField
              label="Date de début"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              label="Date de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Telecharger
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MonthCSVModal;
