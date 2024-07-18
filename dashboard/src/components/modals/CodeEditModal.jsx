import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import { Modal, Button } from "rsuite";
import { TextField } from "@mui/material";

const CodeEditModal = ({ open, setOpen, code, handleState }) => {
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: open ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const [codeName, setCodeName] = useState(code.name);
  const [codeColor, setCodeColor] = useState(code.color);

  const handleSubmit = () => {
    axiosService
      .patch(`code/${code.id}/`, { name: codeName, color: codeColor })
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
    if (code) {
      setCodeName(code.name || "");
      setCodeColor(code.color || "#000000");
    }
  }, [code]);

  const handleColorChange = (e) => {
    setCodeColor(e.target.value);
  };

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
          <Modal.Title>Modifier le CODE {code && code.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="outlined-basic"
            label="Nom du code"
            value={codeName}
            onChange={(e) => {
              setCodeName(e.target.value);
            }}
            fullWidth
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
          <input
            id="color"
            name="color"
            type="color"
            value={codeColor}
            onChange={handleColorChange}
            style={{
              marginBottom: "10px",
              marginTop: "20px",
              width: "100%",
              height: "56px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              padding: "10px",
            }}
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

export default CodeEditModal;
