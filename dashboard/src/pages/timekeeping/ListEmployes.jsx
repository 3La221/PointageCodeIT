import  React , {useState, useEffect}from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { getCompanyID } from '../../helpers/actions';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';


export default function ListEmployes() {
  const [employes, setEmployes] = useState([])  
  const navigate = useNavigate()

  const company_id = getCompanyID()
  useEffect(() => {
    axiosService.get(`company/${company_id}/employes/`).then((res)=>{
      setEmployes(res.data)
    }).catch((err)=>{
      console.log(err)
    })

  },[])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmployes = employes.filter((employe)=> 
  employe.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  employe.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  employe.username.toLowerCase().includes(searchQuery.toLowerCase())
  )





  return (
    <>
  <TextField
  label="Search Employees"
  variant="outlined"
  value={searchQuery}
  onChange={(e)=> setSearchQuery(e.target.value)}
  style={{width:"100%", margin:"10px 0"}}
  
  
  />

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Last Name</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Username</TableCell>
            
            
          </TableRow> 
        </TableHead>
        <TableBody>
          {filteredEmployes.map((employe) => (
            <TableRow
              key={employe.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } , cursor: "pointer" , "&:hover":{backgroundColor:"#f5f5f5"}}}
              onClick={()=>{navigate(`${employe.id}`)}}
            >
              <TableCell component="th" scope="row">
                {employe.first_name}

              </TableCell>
              <TableCell>{employe.last_name}</TableCell>
              <TableCell>{employe.username}</TableCell>
              
            </TableRow>

          ))}
        </TableBody>
      </Table>

      <Outlet />
    </TableContainer>
    </>
    
  );
}