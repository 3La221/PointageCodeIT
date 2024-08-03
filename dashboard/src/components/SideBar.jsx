import React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Dashboard, Man2Outlined } from "@mui/icons-material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RestoreIcon from '@mui/icons-material/Restore';
import { Avatar, List, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { DOMAIN_URL, getCompanyLogo, getCompanyName } from "../helpers/actions";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
// @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  borderRadius: "0 16px 16px 0", // Rounded corners
  backgroundColor: theme.palette.background.paper, // Background color
  boxShadow: open ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none", // Box shadow
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const SideBar = ({ open, handleDrawerClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const sideBarItems1 = [
    {
      text: "Tableau de bord",
      icon: <Dashboard />,
      path: "/",
    },
  ];

  const sideBarItems2 = [
    {
      text: "Comptes employés",
      icon: <GroupOutlinedIcon />,
      path: "/employes",
    },
    {
      text: "Calendrier de pointage",
      icon: <PendingActionsOutlinedIcon />,
      path: "/timekeeping",
    },
    {
      text: "Ajouter un employé",
      icon: <PersonAddAltOutlinedIcon />,
      path: "/addemploye",
    },
  ];

  const sideBarItems3 = [
    {
      text: "Paramètres",
      icon: <SettingsOutlinedIcon />,
      path: "/settings",
    },
    {
      text: "Restaurer",
      icon: <RestoreIcon />,
      path: "/restore",
    },
  ];

  // const logo = getCompanyLogo();
  const company_name = getCompanyName();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Avatar
        sx={{
          mx: "auto",
          width: open ? 88 : 40,
          height: open ? 88 : 40,
          my: 2,
          border: `3px solid ${theme.palette.primary.main}`, // Border color
          borderRadius: "50%", // Round avatar
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, // Gradient background
          transition: "0.25s",
        }}
        alt="Company Logo"
        // src={DOMAIN_URL + logo}
      />
      <Typography
        align="center"
        variant="h6"
        sx={{ 
          fontSize: 18, 
          fontWeight: 600, // Bold text
          display: !open && "none", 
          transition: "0.5s" 
        }}
      >
        {company_name}
      </Typography>
      <Typography
        align="center"
        variant="body1"
        sx={{
          fontSize: 17,
          mb: 1,
          ml: 1,
          display: !open && "none",
          transition: "0.5s",
          color: theme.palette.info.main,
        }}
      >
        Admin
      </Typography>

      <Divider />

      <List>
        {sideBarItems1.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: 24, // Adjust icon size
                    color: theme.palette.primary.main, // Icon color
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {sideBarItems2.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {sideBarItems3.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
