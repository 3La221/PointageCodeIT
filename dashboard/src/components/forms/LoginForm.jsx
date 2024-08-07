import React  , {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../helpers/actions';

const LoginForm = () => {

    const [data, setData] = useState({username: '', password: ''});
    const navigate = useNavigate()
    
    const [error , setError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${API_URL}/company_admin/login/`, data).then((res)=>{          
          localStorage.setItem('auth',JSON.stringify(res.data))
          navigate('/')
          
        }).catch((err)=>{
          console.log(err)
          setError('Nom d\'utilisateur ou mot de passe incorrect')
        })

    }
        
  return (
    <Box
    sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'white',
    }}
  >
    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
      Sign in
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        onChange = {(e) => setData({...data, username: e.target.value})}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange = {(e) => setData({...data, password: e.target.value})}
      />
      {error && <Typography variant="body2" color="error">{error}</Typography>}
     
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      
    </Box>
  </Box>
  )
}

export default LoginForm
