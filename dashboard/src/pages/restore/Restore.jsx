import React, { useEffect, useState } from 'react'
import { getCompanyID } from '../../helpers/actions'
import axiosService from '../../helpers/axios'
import { Paper, TableContainer } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {  Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Divider } from 'rsuite';


const Restore = () => {

    const company_id = getCompanyID()
    const [employes,setEmployes] = useState([])
    useEffect(()=>{
        axiosService.get(`company/${company_id}/employes/?active=false`).then((res)=>{
            setEmployes(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false)
    const [currentEmploye, setCurrentEmploye] = useState(null)





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
                  

                </Stack>
              
                


              </TableCell>
              
            </TableRow>

          ))}
        </TableBody>
      </Table>

      <Outlet />
    </TableContainer>
    <Divider/>

    </>
  )
}

export default Restore
