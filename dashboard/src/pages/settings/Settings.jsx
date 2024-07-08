import React  , {useState , useEffect}from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosService from '../../helpers/axios';
import { getCompanyID } from '../../helpers/actions';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { Wifi } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import CodeEditModal from '../../components/modals/CodeEditModal';
import CodeAddModal from '../../components/modals/CodeAddModal';
import WifiAddModal from '../../components/modals/WifiAddModal';



const Settings = () => {
  const [codes ,setCodes ] = useState([])
  const [wifis ,setWifis ] = useState([])
  const company_id = getCompanyID()
  const fetchCodes = () => {
    axiosService.get(`company/${company_id}/codes/`)
      .then((res) => {
        setCodes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fetchwifis = () => {
    axiosService.get(`company/${company_id}/wifis/`)
      .then((res) => {
        setWifis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  
  }

  useEffect ( () => {
    fetchCodes()
    fetchwifis()
  },[])

  const [doneCode, setDoneCode] = useState({name: 'N/A', meaning: 'No meaning available', color: 'transparent'})
  const [workingCode, setWorkingCode] = useState({name: 'N/A', meaning: 'No meaning available', color: 'transparent'})
  const [pendingCode, setPendingCode] = useState({name: 'N/A', meaning: 'No meaning available', color: 'transparent'})
  const [absentCode, setAbsentCode] = useState({name: 'N/A', meaning: 'No meaning available', color: 'transparent'})
  const [otherCodes, setOtherCodes] = useState([])
  const [codeToEdit, setCodeToEdit] = useState({name: 'N/A', meaning: 'No meaning available', color: 'transparent'}) 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false)
  const [isAddWifiModalOpen, setIsAddWifiModalOpen] = useState(false)


  useEffect(()=>{
    setDoneCode(codes.find((code) => code.role === 'DONE'))
    setWorkingCode(codes.find((code) => code.role === 'WORKING'))
    setPendingCode(codes.find((code) => code.role === 'BREAK'))
    setAbsentCode(codes.find((code) => code.role === 'ABSENT'))
    setOtherCodes(codes.filter((code)=> code.role === "OTHER"))
  
  },[codes])


  const handleEditModalOpen = (code) => {
    setIsEditModalOpen(true)
    setCodeToEdit(code)
  }




 
  return (
       <div>
        <Stack direction="row" spacing={2}>
        <Typography variant='h4' style={{marginLeft: '20px'}}>Codes</Typography>
        <Button variant="contained" color="primary" style={{marginLeft: '20px' }} onClick={()=>{setIsAddCodeModalOpen(true)}}>Ajouter un code</Button>
           </Stack>
        <Divider sx={{margin:"20px"}}/>
        <Typography variant='h5' style={{marginLeft: '40px'}}>Les Codes Principaux </Typography>
            <List dense={false} style={{marginLeft:'50px'}}>
        {doneCode && <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={()=>{handleEditModalOpen(doneCode)}} >
              <EditIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: doneCode.color || 'transparent',
              borderRadius: '50%'
            }}></div>
          </ListItemAvatar>
          <ListItemText
            primary={doneCode.name || 'N/A'}
            secondary={doneCode.meaning || 'No meaning available'}
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
        </ListItem>}

        {workingCode && <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={()=>{handleEditModalOpen(workingCode)}}>
              <EditIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: workingCode.color || 'transparent',
              borderRadius: '50%'
            }}></div>
          </ListItemAvatar>
          <ListItemText
            primary={workingCode.name || 'N/A'}
            secondary={workingCode.meaning || 'No meaning available'}
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
        </ListItem>}

        {pendingCode && <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={()=>{handleEditModalOpen(pendingCode)}}>
              <EditIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: pendingCode.color || 'transparent',
              borderRadius: '50%'
            }}></div>
          </ListItemAvatar>
          <ListItemText
            primary={pendingCode.name || 'N/A'}
            secondary={pendingCode.meaning || 'No meaning available'}
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
        </ListItem>}

        {absentCode && <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={()=>{handleEditModalOpen(absentCode)}}>
              <EditIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: absentCode.color || 'transparent',
              borderRadius: '50%'
            }}></div>
          </ListItemAvatar>
          <ListItemText
            primary={absentCode.name || 'N/A'}
            secondary={absentCode.meaning || 'No meaning available'}
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
        </ListItem>}

        
      
             
              
            </List>
            <Typography variant='h5' style={{marginLeft: '40px'}}>Autre Codes </Typography>

            <List dense={false} style={{marginLeft:'50px'}}>
            {otherCodes.map((code) => (
          <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={()=>{handleEditModalOpen(code)}}>
              <EditIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: code.color || 'transparent',
              borderRadius: '50%',
            }}></div>
          </ListItemAvatar>
          <ListItemText
            primary={code.name || 'N/A'}
            secondary={code.meaning || 'No meaning available'}
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
        </ListItem>

        ))}

            </List>
            
          {/* <Divider sx={{margin:"20px"}}/> */}
          <br/>
        <Stack direction="row" spacing={2}>
        <Typography variant='h4' style={{marginLeft: '20px'}}>ًWifis</Typography>
        <Button variant="contained" color="primary" style={{marginLeft: '20px' }} onClick={()=>setIsAddWifiModalOpen(true)} >Add Wifis</Button>
           </Stack>

        <Divider sx={{margin:"20px"}}/>

        <List dense={false}>
              {
                wifis.map((wifi) => (
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton edge="end" aria-label="edit">
                        <EditIcon/>
                      </IconButton>

                      <IconButton>
                        <DeleteIcon/>
                      </IconButton>
                         </Stack>
                      
                    }

                  >
        <ListItemAvatar>
          <Wifi sx={{height:"40px",width:"40px"}}/>
        </ListItemAvatar>
                    <ListItemText
                      primary={wifi.ssid}
                      secondary={wifi.bssid}
                      primaryTypographyProps={{ style: { fontWeight: 'bold' } }}

                    />
                  </ListItem>
                ) )
              }

              
            </List>

          <CodeEditModal open={isEditModalOpen} setOpen={setIsEditModalOpen} code={codeToEdit} handleState={fetchCodes} />
          <CodeAddModal open={isAddCodeModalOpen} setOpen={setIsAddCodeModalOpen}  handleState={fetchCodes} />
          <WifiAddModal open={isAddWifiModalOpen} setOpen={setIsAddWifiModalOpen}  handleState={fetchwifis} />
          </div>
  )
}

export default Settings
