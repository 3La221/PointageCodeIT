import  React , {useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { API_URL, getCompanyID } from '../../helpers/actions';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosService from "../../helpers/axios";

export default function AddEmploye() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const navigate = useNavigate()
  const company_id = getCompanyID()
  const [data , setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    gender:"",
    company:company_id

  })

  const onSubmit = () => {

    console.log(data);

    axiosService.post(`/employe/`,data).then((res)=>{
      handleClick({ vertical: 'bottom', horizontal: 'center' })()
      navigate("/employes")

      console.log(res)
    }).catch((err)=>{
      console.log(err)
    }
    
  )
  }

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <h2 color="primary" >Create New User</h2>


      <Stack direction={"row"} gap={2}>
        <TextField
          error={Boolean(errors.first_name)}
          helperText={Boolean(errors.first_name) && "Incorrect entry."}
          sx={{ flex: 1 }}
          label="First Name"
          variant="filled"
          {...register("first_name", { required: true, maxLength: 20 })}
          value={data.first_name}
          onChange={(e) => setData(prevData=>({...prevData,first_name:e.target.value}))}
        />
        <TextField
          error={Boolean(errors.last_name)}
          helperText={Boolean(errors.last_name) && "Incorrect entry."}
          sx={{ flex: 1 }}
          label="Last Name"
          variant="filled"
          {...register("last_name", { required: true, maxLength: 20 })}
          value={data.last_name}
          onChange={(e) => setData(prevData=>({...prevData,last_name:e.target.value}))}
        />
      </Stack>

      <TextField
        error={Boolean(errors.phone_number)}
        helperText={Boolean(errors.phone_number) && "Incorrect entry."}
        sx={{ flex: 1 }}
        label="Phone Number"
        variant="filled"
        {...register("phone_number", { required: true, maxLength: 20 })}
        value={data.phone_number}
        onChange={(e) => setData(prevData=>({...prevData,phone_number:e.target.value}))}
      />
      <TextField
        error={Boolean(errors.email)}
        helperText={
          Boolean(errors.email) && "Please provide a valid email address."
        }
        sx={{ flex: 1 }}
        label="Email"
        variant="filled"
        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        value={data.email}
        onChange = {(e) => setData(prevData=>({...prevData,email:e.target.value}))}
      />

      <Stack direction={"row"} gap={2}>

      <TextField
        error={Boolean(errors.password)}
        helperText={
          Boolean(errors.password)
        }
        sx={{ flex: 1 }}
        label="Password"
        variant="filled"
        {...register("password", { required: "Password is required"})}
        type="password"
        value={data.password}
        onChange={(e) => setData(prevData=>({...prevData,password:e.target.value}))}

      />

    <TextField
        error={Boolean(errors.confirmPassword)}
        helperText={
          Boolean(errors.confirmPassword)}
        sx={{ flex: 1 }}
        label="Confirm Password"
        variant="filled"
        {...register("confirmPassword", 
          { required: "Password is required",
            validate : (value) => value === password || "The passwords do not match"

          })}
        type="password"
      />
      

      </Stack>
<Box sx={{textAlign:"left"}}>
<FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-filled-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={data.gender}
          onChange={(e) => setData(prevData=>({...prevData,gender:e.target.value}))}
        >
          
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
      
        </Select>
      </FormControl>
  
</Box> 
      

      <Box sx={{ textAlign: "right" }}>
        <Button variant="contained" type="submit">
          Create New User
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
      
        key={vertical + horizontal}
      >
        <Alert variant="filled" severity="success">
          User Created Successfully
        </Alert>

        </Snackbar>
    </Box>
  );
}
