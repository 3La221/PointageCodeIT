import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, TextField, Box, Typography, Tooltip } from '@mui/material';
import { Edit as EditIcon, RemoveCircle as RemoveCircleIcon } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { getCompanyID } from '../../helpers/actions';
import DeleteModal from '../../components/modals/DeleteModal';
import EmployeEditModal from '../../components/modals/EmployeEditModal';
import TablePagination from '@mui/material/TablePagination';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

const Employees = () => {
  const [employes, setEmployes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem("theme") || 'light');

  const company_id = getCompanyID();

  const fetchEmployes = () => {
    axiosService.get(`company/${company_id}/employes/?active=true`)
      .then((res) => {
        setEmployes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  const handleState = (newState) => {
    fetchEmployes();
  };

  const filteredEmployes = employes.filter((employe) =>
    employe.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employe.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employe.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFirstLoginBoolean = (id) => {
    console.log("THERE")
    axiosService.patch(`employe/${id}/`, {is_first_login: false})
    .then((res) => {
      console.log(res)
      fetchEmployes();
    })
    .catch((err) => {
      console.log(err);
    }); }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        
        <h2 style={{marginBottom:"5px"}}>
        Liste d'Employés
        </h2>
        <TextField
          label="Rechercher des employés"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="employes table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Numéro de téléphone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployes.map((employe) => (
              <TableRow
                key={employe.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  '&:hover': mode === 'light' ? { backgroundColor: '#f0f0f0' } : { backgroundColor: '#424242' },
                  transition: 'background-color 0.3s ease'
                }}
              >
                <TableCell component="th" scope="row">
                  {employe.first_name}
                </TableCell>
                <TableCell>{employe.last_name}</TableCell>
                <TableCell>{employe.username}</TableCell>
                <TableCell>{employe.phone_number}</TableCell>
                <TableCell>{employe.email}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => {
                      setCurrentEmploye(employe);
                      setIsEditModalOpen(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => {
                      setIsDeleteModalOpen(true);
                      setCurrentEmploye(employe);
                    }}>
                      <RemoveCircleIcon />
                    </IconButton>
                    {
  !employe.is_first_login ? 
    <Tooltip title="Permettre à l'utilisateur de se connecter avec un autre téléphone" placement="top">
      <IconButton color="primary" onClick={() => {
        openFirstLoginBoolean(employe.id);
      }}>
        <AccountCircleIcon />
      </IconButton>
    </Tooltip>
  :
    <Tooltip title="L'utilisateur peut connecter " placement="top">
      <IconButton  onClick={() => {
      }}>
        <AccountCircleIcon />
      </IconButton>
    </Tooltip>
}

                    
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Outlet />
      </TableContainer>

      <DeleteModal open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} employe={currentEmploye} handleState={handleState} />
      <EmployeEditModal open={isEditModalOpen} setOpen={setIsEditModalOpen} employe={currentEmploye} handleState={handleState} />
    </>
  );
};

export default Employees;
