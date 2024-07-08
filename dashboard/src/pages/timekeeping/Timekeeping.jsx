import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Badge } from 'rsuite';
import axiosService from '../../helpers/axios';
import AttendanceEditModal from '../../components/modals/AttendanceEditModal';
import { getCompanyID } from '../../helpers/actions';
import { Button } from '@mui/material';
import { set } from 'react-hook-form';

const Timekeeping = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { id: employeeId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [codes,setCodes] = useState([])
  const [formattedDate, setFormattedDate] = useState('')
  const company_id = getCompanyID()


  const fetchAttendance = async (year, month) => {
    axiosService.get(`employe/${employeeId}/pointings/?date=${year}-${month}`)
      .then((res) => {
        setData(res.data.results);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(()=>{
    axiosService
    .get(`company/${company_id}/codes/`)
    .then((res)=>{
        setCodes(res.data)
    }).catch((err)=>{
        console.log(err)
    })
},[])

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    fetchAttendance(year, month);
  }, [currentMonth]);


  const renderCell = (date) => {
    if (isLoading) return (<div>Loading...</div>);
  
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  
    const item = data.find((item) => item.date === formattedDate);



    return (
      <div>
        <style>
          {`
            @keyframes flash {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }

           
              
          `}
        </style>
        <div 
        className="calendar-day-labels" 
        onClick={() => {setIsEditModalOpen(true); setFormattedDate(formattedDate)}} >
          {item ? (
            <Badge
              content={item.code.name}
              style={{
                backgroundColor:item.code.color,
                animation: item.code.name === "W" ? "flash 1s infinite" : "none",
              }}
            />
            
          ) : null}

        </div>
        <Button onClick={() => {setIsEditModalOpen(true); setFormattedDate(formattedDate)}}>Edit</Button>
      </div>
    );
  };

  const handlePanelChange = (date) => {
    console.log("DATE", data);
    setCurrentMonth(date);
  };

  return (
    <>
    <Calendar
      bordered
      renderCell={renderCell}
      onChange={handlePanelChange}
      style={{ width: '90%', height: 'auto', margin: '0 auto' }}
    />
    <AttendanceEditModal
     open={isEditModalOpen} 
    setOpen={setIsEditModalOpen}
      date={formattedDate}
       employeId={employeeId} 
       codes={codes} />
    </>
    
  );
};

export default Timekeeping;
