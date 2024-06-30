import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Whisper, Popover, Badge } from 'rsuite';
import axiosService from '../../helpers/axios';
import axios from 'axios';



const Timekeeping = () => {

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { id: employeeId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendance = async (year, month) => {
   

    axiosService.get(`employe/${employeeId}/pointings/?date=${year}-${month}`).then((res)=>{
      setData(res.data.results)
      setIsLoading(false)
      console.log(res.data)
    }).catch((err)=>{
      console.log(err)
    })
  };

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    fetchAttendance(year, month);
  }, [currentMonth]);



  const renderCell = (date) => {
    if (isLoading) return (<div>Loading...</div>);
  
    // Format the date parameter to a simple YYYY-MM-DD string in local time
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'), // Months are 0-based
      String(date.getDate()).padStart(2, '0') // Get the day of the month
    ].join('-');
  
    const item = data.find((item) => item.date === formattedDate);
  
  
    return (
      <div>
        <div className="calendar-day-labels">
          {item ? <Badge content={item.code} style={{ backgroundColor: item.code === "T" ? "green" : "red" }} /> : null}
        </div>
      </div>
    );
  };

  const handlePanelChange = (date) => {
    console.log("DATE",data)
    setCurrentMonth(date);
  };

  return (
    <Calendar
      bordered
      renderCell={renderCell}
      onChange={handlePanelChange}
      style={{ width: '90%', height: 'auto', margin: '0 auto' }}
    />
  );
};

export default Timekeeping;
