import React ,{useState , useEffect} from 'react'
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { TextField } from '@mui/material';
import { set } from 'react-hook-form';


const CodeEditModal = ({ open, setOpen, employe ,handleState}) => {
    const handleClose = () => setOpen(false);

    const modalWrapperStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };
    

    
    const [newEmploye , setNewEmploye] = useState(employe)
  
  
    const handleSubmit = () =>{
      axiosService.patch(`employe/${employe.id}/`,{newEmploye}).then((res)=>{
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
            <Modal.Title>Modifier {employe && employe.username} CODE</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <TextField
           id="outlined-basic"
           label="Nom d'utilisateur"
             value={newEmploye.username} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , username : e.target.value})
             }}/>
          <TextField
           id="outlined-basic"
           label="Email"
             value={newEmploye.email} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , email : e.target.value})
             }}/>

             <TextField
           id="outlined-basic"
           label="Numéro de téléphone"
             value={newEmploye.username} 
             onChange={(e)=>{
              setNewEmploye({...newEmploye , username : e.target.value})
             }}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit} appearance="primary" color='red'>
              YES !
            </Button>
            <Button onClick={handleClose}  appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default CodeEditModal
