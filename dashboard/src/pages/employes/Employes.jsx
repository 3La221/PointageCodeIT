import React from 'react'
import { DataGrid } from '@mui/x-data-grid';


const rows = [
  { id: 1, col1: 'Mohammed', col2: 'Akram' ,col3: 'mohammed.akram', col4: '01111111111' },
  { id: 2, col1: 'Alaa', col2: 'Salah',col3: 'alaa.salah', col4: '01111111111'},
  { id: 3, col1: 'Ramy', col2: 'Anis',col3:'ramy.anis' , col4: '01111111111'},
  
];

const columns = [
  { field: 'col1', headerName: 'First Name', width: 150 },
  { field: 'col2', headerName: 'Last Name', width: 150 },
  { field: 'col3', headerName: 'Username', width: 150 },
  { field: 'col4', headerName: 'Phone Number', width: 150 },
];

const Employes = () => {
  return (
    <div>
      <h1>Employes</h1>
      <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
      </div>



    </div>
  )
}

export default Employes
