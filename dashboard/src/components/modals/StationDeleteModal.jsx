import axiosService from '../../helpers/axios';
import React from 'react';
import { Modal, Button } from 'rsuite';

const StationDeleteModal = ({open , setOpen , station , handleState}) => {
    const handleClose = () => setOpen(false);

    const modalWrapperStyle = {
      display: open ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };
  
    const handleSubmit = () => {
      if (!station) return; // Vérifier si employe est null ou undefined
  
      axiosService.delete(`station/${station.id}/`)
        .then((res) => {
          console.log(res);
          handleClose();
          handleState({ isSnackOpen: true , element : "Station"}); // Optionnel : donner un retour à l'utilisateur
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
            <Modal.Title>Suprimmer la station  {station?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir suprimmer  {station?.name} ?
            <br />
            <br />
        
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit} appearance="primary" color='red'>
              Suprimmer
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default StationDeleteModal
