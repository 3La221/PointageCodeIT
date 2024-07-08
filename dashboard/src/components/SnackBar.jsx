import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SnackBar = ({isSnackOpen,handleClose,message}) => {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        open={isSnackOpen}
        onClose={handleClose}
        autoHideDuration={3000}
      
      >
        <Alert variant="filled" severity="info">
          {message}
        </Alert>

      </Snackbar>
    </div>
  )
}

export default SnackBar
