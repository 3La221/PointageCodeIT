import axiosService from '../../helpers/axios';
import React from 'react';
import { Modal, Button } from 'rsuite';

const WifiDeleteModal = ({open , setOpen , wifi , handleState}) => {
    const handleClose = () => setOpen(false);

    const modalWrapperStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };
  
    const handleSubmit = () => {
      if (!wifi) return; // Vérifier si employe est null ou undefined
  
      axiosService.delete(`wifi/${wifi.id}/`)
        .then((res) => {
          console.log(res);
          handleClose();
          handleState({ isSnackOpen: true , element : "Wifi"}); // Optionnel : donner un retour à l'utilisateur
        })
        .catch((err) => {
          console.log(err);
          // Gérer l'erreur, afficher un message d'erreur, etc.
        });
    };
  
    return (
      <div style={modalWrapperStyle}>
        <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Modal.Header>
            <Modal.Title>Désactiver le compte de {wifi?.ssid}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir désactiver le compte de {wifi?.ssid} ?
            <br />
            <br />
        
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit} appearance="primary" color='red'>
              Oui !
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default WifiDeleteModal
