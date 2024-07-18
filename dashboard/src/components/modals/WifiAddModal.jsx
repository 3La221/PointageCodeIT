import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';


const WifiAddModal = ({ open, setOpen, handleState }) => {
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: open ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  
  const company_id = getCompanyID();
  const [newWifi, setNewWifi] = useState({
    ssid:"",
    bssid:"",
    company: company_id,
  }) ;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWifi((prevCode) => ({
      ...prevCode,
      [name]: value,
    }));
  };

  const handleSubmit = () => {

    axiosService
      .post('wifi/', newWifi)
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
          <Modal.Title>Add New Wifi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="ssid"
            name="ssid"
            label="SSID"
            variant="outlined"
            value={newWifi.ssid}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px' , marginTop: '10px'}}
          />
          <TextField
            id="bssid"
            name="bssid"
            label="Bssid"
            variant="outlined"
            value={newWifi.bssid}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Save
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WifiAddModal;
