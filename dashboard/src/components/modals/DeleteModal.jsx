import axiosService from '../../helpers/axios';
import React from 'react';
import { Modal, Button, Placeholder } from 'rsuite';

const DeleteModal = ({ open, setOpen, employe,setState }) => {
  const handleClose = () => setOpen(false);
  const handleState = (newState) => setState({ ...newState, isSnackOpen: true });

  const modalWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  };



  const handleSubmit = () =>{
    axiosService.delete(`employe/${employe.id}/deactivate`).then((res)=>{
      console.log(res)
      handleClose()
      handleState()
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div style={modalWrapperStyle}>
      <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex' , flexDirection : 'column' , justifyContent : 'center' , height:'100%'}}>
        <Modal.Header>
          <Modal.Title>Deactivate {employe && employe.last_name} Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Are you sure you want to deactivate {employe && employe.username} account ?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary" color='red'>
            YES !
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteModal;
