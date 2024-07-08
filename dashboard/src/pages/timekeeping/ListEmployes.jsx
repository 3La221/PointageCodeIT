import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { DOMAIN_URL, getCompanyID } from '../../helpers/actions';
import { Badge, Button, Stack, TextField } from '@mui/material';
import MonthCSVModal from '../../components/modals/MonthCSVModal';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


export default function ListEmployes() {
  const [employes, setEmployes] = useState([]);
  const [pointings, setPointings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMonthCSVModalOpen, setIsMonthCSVModalOpen] = useState(false);
  const navigate = useNavigate();


  const company_id = getCompanyID();

  useEffect(() => {
    axiosService.get(`company/${company_id}/employes/`).then((res) => {
      setEmployes(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [company_id]);

  useEffect(() => {
    axiosService.get(`company/${company_id}/today_pointings/`).then((res) => {
      setPointings(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [company_id]);

  const filteredEmployes = employes.filter((employe) => 
    employe.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employe.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employe.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPointingForEmployee = (employeeId) => {
    return pointings.find(pointing => pointing.employe === employeeId);
  };

  function todayattendance() {
    axiosService.get(`company/${company_id}/today_in_csv/`).then((res) => {
        const donlowadURL = DOMAIN_URL + res.data.file_url
        window.location.href = donlowadURL
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
     <style>
          {`
            @keyframes flash {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }

           
              
          `}
        </style>
    <h2 style={{marginBottom:"5px"}}>
    Calendrier de pointage
    </h2>
    <Stack direction="row" spacing={2} style={{marginBottom:"10px"}}>
    <Button variant="contained" onClick={() => { todayattendance() }} endIcon={<ArrowCircleDownIcon/>}>Télécharger le rapport de présence du jour</Button>
    <Button variant="contained" onClick={() => { setIsMonthCSVModalOpen(true) }} endIcon={<ArrowCircleDownIcon/>}>Télécharger le rapport de présence mensuel</Button>
    </Stack>
    
      <TextField
        label="Rechercher des employés"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "100%", margin: "10px 0" }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell >Présence d'aujourd'hui</TableCell>
            </TableRow> 
          </TableHead>
          <TableBody>
            {filteredEmployes.map((employe) => {
              const pointing = getPointingForEmployee(employe.id);
              return (
                <TableRow
                  key={employe.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                  onClick={() => { navigate(`${employe.id}`); }}
                >
                  <TableCell component="th" scope="row">{employe.first_name}</TableCell>
                  <TableCell>{employe.last_name}</TableCell>
                  <TableCell>{employe.username}</TableCell>
                  <TableCell align='left' >
                    {pointing ? (
                      <Badge 
                        badgeContent={pointing.code.name}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: pointing.code.color,
                            color: 'white',
                            animation: pointing.code === "W" ? "flash 1s infinite" : "none", 
                            marginLeft: "5px"
                          }
                        }}
                      />
                    ) : (
                      <Badge color="secondary" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Outlet />
      </TableContainer>
      
      <MonthCSVModal employes={employes}  open={isMonthCSVModalOpen} setOpen={setIsMonthCSVModalOpen} handleState={() => {}} />
      
    </>
  );
}
