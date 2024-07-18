import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import { Modal, Button } from "rsuite";
import { TextField } from "@mui/material";

const WifiEditModal = ({ open, setOpen, wifi, handleState }) => {
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: open ? 'flex' : 'none',
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const [wifiSsid, setWifiSsid] = useState(wifi.ssid);
  const [wifiBssid, setWifiBssid] = useState(wifi.bssid);

  const handleSubmit = () => {
    axiosService
      .patch(`wifi/${wifi.id}/`, { ssid: wifiSsid, bssid: wifiBssid })
      .then((res) => {
        console.log(res);
        handleClose();
        handleState();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (wifi) {
        setWifiSsid(wifi.ssid || '');
        setWifiBssid(wifi.bssid || '');
    }
  }, [wifi]);

  

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
          <Modal.Title>Modifier le Modem {wifi && wifi.ssid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="outlined-basic"
            label="SSID du modem"
            value={wifiSsid}
            onChange={(e) => {
              setWifiSsid(e.target.value);
            }}
            fullWidth
            sx={{ marginBottom: 2  , marginTop: 2 }}
          />
          <TextField
            id="outlined-basic"
            label="BSSID du modem"
            value={wifiBssid}
            onChange={(e) => {
              setWifiBssid(e.target.value);
            }}
            fullWidth
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

export default WifiEditModal;
