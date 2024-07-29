import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { Box, Stack, useTheme } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined, Person2Outlined } from "@mui/icons-material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from "../helpers/actions";
import AdminAccountModal from "./modals/AdminAccountModal";

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const theme = useTheme();
  const [isAddAdminAccountModalOpen, setIsAddAdminAccountModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box flexGrow={1} />

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
          </Typography>

          <Stack direction="row">
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.setItem('theme', theme.palette.mode === 'light' ? 'dark' : 'light');
                setMode((prevMode) =>
                  prevMode === 'light' ? 'dark' : 'light',
                );
              }}
            >
              {theme.palette.mode === 'light' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            <IconButton
              color="inherit"
              aria-controls={openAnchor ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openAnchor ? 'true' : undefined}
              onClick={handleClick}
            >
              <Person2Outlined />
            </IconButton>
          </Stack>
        </Toolbar>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={openAnchor}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            marginTop: "35px"
          }}
        >
          <MenuItem onClick={() => { setIsAddAdminAccountModalOpen(true) }}>Ajouter Compte Admin</MenuItem>
          <MenuItem onClick={logout}>Se Déconnecter</MenuItem>
        </Menu>
      </AppBar>
      <AdminAccountModal open={isAddAdminAccountModalOpen} setOpen={setIsAddAdminAccountModalOpen} handleState={() => { }} />
    </>
  );
};

export default TopBar;
