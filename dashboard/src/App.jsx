import React from 'react';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import { getDesignTokens } from './theme';
import { Outlet } from 'react-router-dom';
import Loader from './components/Loader'; // Import the loader

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function App() {
  const [mode, setMode] = React.useState(localStorage.getItem("theme") || 'light');
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000); // Set loading to false after 2 seconds
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar open={open} handleDrawerOpen={handleDrawerOpen} setMode={setMode}/>
        <SideBar open={open} handleDrawerClose={handleDrawerClose} />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 3 }}>
      <img src="src/assets/logo1.png" alt="logo" style={{ width: "20%" }} />
    </Box>

          {isLoading ? <Loader /> : <Outlet />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
