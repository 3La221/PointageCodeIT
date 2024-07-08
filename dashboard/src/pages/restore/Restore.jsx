import React, { useEffect, useState } from 'react'
import { getCompanyID } from '../../helpers/actions'
import axiosService from '../../helpers/axios'
import { Paper, TableContainer } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {  Stack , IconButton } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Divider } from 'rsuite';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RestoreIcon from '@mui/icons-material/Restore';
import SnackBar from '../../components/SnackBar'

const Restore = () => {
    const navigate = useNavigate()
    const company_id = getCompanyID()
    const [employes,setEmployes] = useState([])
    const fetchEmployes = () => {
      axiosService.get(`company/${company_id}/employes/?active=false`)
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

    const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false)
    const [currentEmploye, setCurrentEmploye] = useState(null)
    const [isSnackOpen, setIsSnackOpen] = useState(false)

    const handleRestore = (employe) => {
      axiosService.patch(`employe/${employe.id}/activate/`).then((res)=>{
        setIsSnackOpen(true)
        fetchEmployes();

      
      }).catch((err)=>{
        console.log(err)
      })
    }



  return (
    <>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Last Name</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Phone Number</TableCell>
          <TableCell>Email</TableCell>
          <TableCell align='center'></TableCell>
            
          </TableRow> 
        </TableHead>
        <TableBody>
          {employes.map((employe) => (
            <TableRow
              key={employe.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } , cursor: "pointer" , "&:hover":{backgroundColor:"#f5f5f5"}}}
            >
              <TableCell component="th" scope="row">
                {employe.first_name}

              </TableCell>
              <TableCell>{employe.last_name}</TableCell>
              <TableCell>{employe.username}</TableCell>
              <TableCell>{employe.phone_number}</TableCell>
              <TableCell>{employe.email}</TableCell>
              <TableCell align='right'> 

                <Stack direction={"row"} > 
                  <IconButton color="inherit" onClick={()=>{setIsPermanentDeleteModalOpen(true) ; setCurrentEmploye(employe);}}>
                      <HighlightOffIcon/>
                  </IconButton>

                  <IconButton color="inherit"  onClick={()=>handleRestore(employe)}>
                        <RestoreIcon/>
                  </IconButton>

                </Stack>
              
                


              </TableCell>
              
            </TableRow>

          ))}
        </TableBody>
      </Table>

      <Outlet />
    </TableContainer>
    <Divider/>

    <SnackBar isSnackOpen={isSnackOpen} handleClose={()=>setIsSnackOpen(false)} message="Employe Restored !" />

    </>
  )
}

export default Restore
