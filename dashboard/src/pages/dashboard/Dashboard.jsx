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
        {/* <img src="src\assets\logo1.png" alt="logo" style={{width:"300px"}}/> */}

   </div>
  )
}

export default Dashboard



