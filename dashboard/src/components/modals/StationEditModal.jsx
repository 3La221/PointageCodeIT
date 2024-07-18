import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import { Modal, Button } from "rsuite";
import { TextField } from "@mui/material";


const StationEditModal = ({open , setOpen , station , handleState}) => {
    const handleClose = () => setOpen(false);

    const modalWrapperStyle = {
      display: open ? 'flex' : 'none',
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    };
  
    const [stationName, setStationName] = useState(station.name);
    const [stationLongitude, setStationLongitude] = useState(station.longitude);
    const [stationLatitude, setStationLatitude] = useState(station.latitude);
  
    const handleSubmit = () => {
      axiosService
        .patch(`station/${station.id}/`, { name: stationName, loogitude: stationLongitude , latitude: stationLatitude })
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
    if (station) {
        setStationName(station.name || '');
        setStationLatitude(station.latitude || 0.0);
        setStationLongitude(station.longitude || 0.0);
    }
  }, [station]);
  
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
            <Modal.Title>Modifier la station {station && station.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField
              id="outlined-basic"
              label="Nom de la station"
              value={stationName}
              onChange={(e) => {
                setStationName(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: 2  , marginTop: 2 }}
            />
            <TextField
              id="outlined-basic"
              label="Longitude"
              value={stationLongitude}
              onChange={(e) => {
                setStationLongitude(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: 2  , marginTop: 2 }}
            />

        <TextField
              id="outlined-basic"
              label="Longitude"
              value={stationLatitude}
              onChange={(e) => {
                setStationLatitude(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: 2  , marginTop: 2 }}
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
}

export default StationEditModal
