import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/dashboard/Dashboard';
import AddEmploye from './pages/addemploye/AddEmploye';
import Employes from './pages/employes/Employes';
import Timekeeping from './pages/timekeeping/Timekeeping';
import Settings from './pages/settings/Settings';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route index element={<Dashboard />} />
      <Route path='employes' element={<Employes />} />
      <Route path='timekeeping' element={<Timekeeping/>} />
      <Route path='addemploye' element={<AddEmploye />} />
      <Route path='settings' element={<Settings/>} />
      <Route path='*' element={<h1>404 Not Found</h1>} />

      

    </Route>
    
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode> );