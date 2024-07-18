import  React , {useState, useEffect}from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Outlet } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { ex_theme, getCompanyID } from '../../helpers/actions';
import {  IconButton, Stack, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteModal from '../../components/modals/DeleteModal';
import { Divider } from 'rsuite';
import EmployeEditModal from '../../components/modals/EmployeEditModal';
import TablePagination from '@mui/material/TablePagination';


export default function Employees() {
  const [employes, setEmployes] = useState([])  
  const company_id = getCompanyID()

  const fetchEmployes = () => {
    axiosService.get(`company/${company_id}/employes/?active=true`)
      .then((res) => {
        setEmployes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  


  }
  useEffect(() => {
    fetchEmployes();

  },[])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentEmploye, setCurrentEmploye] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [state, setState] = React.useState({
    isSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    phrase: "",
    color: "error",
  });

  const { vertical, horizontal, isSnackOpen , phrase , color } = state;


  const filteredEmployes = employes.filter((employe)=> 
  employe.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  employe.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  employe.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClose = () => {
    setState({ ...state, isSnackOpen: false});

  };
  
  const handleState = (newState) =>{

    setState({ ...newState, isSnackOpen: true });
    fetchEmployes();

  } 

  const handleEdit = (newState) =>{
    setState({ ...newState, isSnackOpen: true });
    fetchEmployes();
  }

  const [mode, setMode] = React.useState(localStorage.getItem("theme") || 'light');

  

  return (
    <>

    <h2 style={{marginBottom:"20px"}}>
    Liste d'Employés
    </h2>
  <TextField
  label="Rechercher des employés"
  variant="outlined"
  value={searchQuery}
  onChange={(e)=> setSearchQuery(e.target.value)}
  style={{width:"100%", margin:"10px 0"}}
  
  
  />

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Nom</TableCell>
          <TableCell>Prénom</TableCell>
          <TableCell>Nom d'utilisateur</TableCell>
          <TableCell>Numéro de téléphone</TableCell>
          <TableCell>Email</TableCell>
          <TableCell align='center'></TableCell>
            
          </TableRow> 
        </TableHead>
        <TableBody>
          {filteredEmployes.map((employe) => (
            <TableRow
              key={employe.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } , cursor: "pointer" ,
               "&:hover": mode === "light" ? {   backgroundColor:"#f5f5f5"} : {backgroundColor : "#575353"},
                transition: "background-color 0.3s ease"
              
              }}
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
                  <IconButton color="inherit" onClick={ () => {
                    setCurrentEmploye(employe)
                    setIsEditModalOpen(true)
                  }}>
                    <EditIcon/>
                  </IconButton>

                  <IconButton color="inherit" onClick={()=>{setIsDeleteModalOpen(true) ; setCurrentEmploye(employe);}}>
                    <RemoveCircleIcon/>
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
    <DeleteModal open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} employe={currentEmploye} handleState={handleState} />
    <EmployeEditModal open={isEditModalOpen} setOpen={setIsEditModalOpen} employe={currentEmploye} handleState={handleState} />

    {/* <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        open={isSnackOpen}
        onClose={handleClose}
        autoHideDuration={3000}
      
        key={vertical + horizontal}
      >
        <Alert variant="filled" severity={color}>
        {{phrase}}
        </Alert>

      </Snackbar> */}

    </>
    
  );
}