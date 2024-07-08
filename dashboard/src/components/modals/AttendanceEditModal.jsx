import React ,{useState , useEffect} from 'react'
import axiosService from '../../helpers/axios';
import { Modal, Button } from 'rsuite';
import { MenuItem, TextField } from '@mui/material';
import { set } from 'react-hook-form';
import { getCompanyID } from '../../helpers/actions';


const AttendanceEditModal = ({ open, setOpen , codes ,date,employeId}) => {
    const handleClose = () => setOpen(false);
    const company_id = getCompanyID();



    const modalWrapperStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };
    

    const [codeID, setCodeID] = useState('')

    

  
  
    const handleSubmit = () =>{
        axiosService
        .post(`employe/${employeId}/change_code/`,{date:date,code_id:codeID})
        .then((res)=>{
            console.log(res.data)
            handleClose()
        }).catch((err)=>{

        })

    }
    

    
      
    return (
      <div style={modalWrapperStyle}>
        <Modal open={open} onClose={handleClose} size="xs" style={{ display: 'flex' , flexDirection : 'column' , justifyContent : 'center' , height:'100%'}}>
          <Modal.Header>
            <Modal.Title>Modifier </Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="EUR"
          helperText="Please select your currency"
          onChange={(e)=>{setCodeID(e.target.value)}}
          
        >
            {
                codes.map((code) => (
                    <MenuItem key={code.id} value={code.id}>
                    {code.name}
                    </MenuItem>
                ))
            }
          
        </TextField> 
                 
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

export default AttendanceEditModal
