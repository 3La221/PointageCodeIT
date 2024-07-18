import React ,{useState , useEffect} from 'react'
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { Alert, TextField } from '@mui/material';
import { set } from 'react-hook-form';
import { getCompanyID } from '../../helpers/actions';


const CodeEditModal = ({ open, setOpen, employe ,handleState}) => {
    const handleClose = () => setOpen(false);

    const modalWrapperStyle = {
      display: open ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };
    
    const company_id = getCompanyID()
    
    const [newEmploye , setNewEmploye] = useState( {
      first_name : "",
      last_name:"" ,
      email : "",
      phone_number : "",
      company: company_id
    })
  
  
    const handleSubmit = () =>{
      axiosService.patch(`employe/${employe.id}/`,newEmploye).then((res)=>{
        console.log(res)
        handleClose()
        handleState()
  
      }).catch((err)=>{
        console.log(err)
        setError(err.response.data)
      })
    }

    useEffect(() => {
      if(employe){
        setNewEmploye(employe)
      }
    }, [employe])
    
    const [error, setError] = useState('');
      
    return (
      <div style={modalWrapperStyle} className='.rs-theme-dark'>
        <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex' , flexDirection : 'column' , justifyContent : 'center' , height:'100%'}}>
          <Modal.Header>
            <Modal.Title>Modifier {employe && employe.username} compte </Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <TextField
          sx={{width : '100%', marginBottom : '10px' , marginTop : '10px'}}
           id="outlined-basic"
           label="Prenom"
             value={newEmploye.first_name} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , first_name : e.target.value})
             }}
             
             />

             <TextField
          sx={{width : '100%', marginBottom : '10px' , marginTop : '10px'}}
           id="outlined-basic"
           label="Nom"
             value={newEmploye.last_name} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , last_name : e.target.value})
             }}/>
          <TextField
              sx={{width : '100%', marginBottom : '10px' , marginTop : '10px'}}

           id="outlined-basic"
           label="Email"
             value={newEmploye.email} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , email : e.target.value})
             }}/>

             <TextField
                       sx={{width : '100%', marginBottom : '10px' , marginTop : '10px'}}

           id="outlined-basic"
           label="Numéro de téléphone"
             value={newEmploye.phone_number} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , phone_number : e.target.value})
             }}/>

      
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit} appearance="primary" >
              Modifier
            </Button>
            <Button onClick={handleClose}  appearance="subtle">
            Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default CodeEditModal
