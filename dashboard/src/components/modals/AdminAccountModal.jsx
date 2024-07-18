import React, { useState } from 'react';
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { TextField, Alert } from '@mui/material';
import { getCompanyID } from '../../helpers/actions';

const AdminAccountModal = ({ open, setOpen, handleState }) => {
  const handleClose = () => setOpen(false);

  const modalWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const company_id = getCompanyID();

  const [newAccount, setNewAccount] = useState({
    company: company_id,
    username: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setNewAccount((prevCode) => ({
        ...prevCode,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (newAccount.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    axiosService
      .post('company_admin/', newAccount)
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
          <Modal.Title>Ajouter un nouveau compte Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="username"
            name="username"
            label="Nom d'utilisateur"
            variant="outlined"
            value={newAccount.username}
            onChange={handleChange}
            fullWidth
            style={{ marginTop: '10px'  , marginBottom: '10px' }}
          />
          <TextField
            id="password"
            name="password"
            label="Mot de passe"
            variant="outlined"
            value={newAccount.password}
            onChange={handleChange}
            fullWidth
            style={{ marginTop: '10px'  , marginBottom: '10px' }}
            type='password'
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmer Mot de passe"
            variant="outlined"
            value={confirmPassword}
            onChange={handleChange}
            fullWidth
            style={{ marginTop: '10px'  , marginBottom: '10px' }}
            type='password'
          />
          {error && (
            <Alert severity="error" style={{ marginBottom: '10px' }}>
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
            Ajouter
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminAccountModal;
