import React , {useEffect, useState} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import axiosService from '../../helpers/axios';
import { getCompanyID } from '../../helpers/actions';
import { Stack } from 'rsuite';
import { Divider, Typography } from '@mui/material';

const Dashboard = () => {

  const company_id = getCompanyID();

  const [todayData,setTodayData] = useState([]);  
  const fetchTodayStats = () =>{

    axiosService.get(`company/${company_id}/today_stats/`).then((res) => {
      setTodayData(res.data)

    }).catch((err) => {
      console.log(err);
    })
  }

  
  useEffect(() => {
    fetchTodayStats();
   
  
  },[])


  return (
    <div>
      < >
        <Typography variant='h3' style={{
          display:"flex" ,
          justifyContent:"center",
          alignItems:"center",
          marginBottom :"20px",
          
          width:"100%"}}>Les statistique de les dernier 7 jours </Typography>
                 <Divider/>
          <div
          style={{
            backgroundColor:"#eee",
            width:"600px",
            borderRadius:"30px",
            margin:"10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center"
          }}
          >
            <h2>
              L'employe de semaine
            </h2>

            <h3>
              Abacha Ala Eddine Salah
            </h3>
          <h3>
            1H 30 Min
          </h3>

          </div>


      </>
      
      
    </div>
  )
}

export default Dashboard



