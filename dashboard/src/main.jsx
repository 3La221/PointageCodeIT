import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import AddEmploye from './pages/addemploye/AddEmploye';
import Employes from './pages/employes/Employes';
import Settings from './pages/settings/Settings';
import Timekeeping from './pages/timekeeping/Timekeeping';
import 'rsuite/dist/rsuite.min.css';  // or 'rsuite/styles/index.less';
import { CustomProvider } from 'rsuite';
import PlainLayout from './components/PlainLayout';
import ListEmployes from './pages/timekeeping/ListEmployes';
import ProtectedRoute from './components/route/ProtectedRoute';
import Login from './pages/Login'
import Restore from './pages/restore/Restore';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     <Route path="/" element={<App />}>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="employes"
        element={
          <ProtectedRoute>
            <Employes />
          </ProtectedRoute>
        }
      />
      <Route
        path="timekeeping"
        element={
          <ProtectedRoute>
            <ListEmployes />
          </ProtectedRoute>
        }
      />
      <Route
        path="timekeeping/:id"
        element={
          <ProtectedRoute>
            <Timekeeping />
          </ProtectedRoute>
        }
      />
      <Route
        path="addemploye"
        element={
          <ProtectedRoute>
            <AddEmploye />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/restore" element={
        <ProtectedRoute>
          <Restore/>
        </ProtectedRoute>
      } />
      <Route path="*" element={<h1>404 Not Found</h1>} />
      <Route path="test" element={<PlainLayout>TEST</PlainLayout>} />

    </Route>
    <Route path="login" element={<Login />} />
    </>
   
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <CustomProvider 
      theme="light">
        <RouterProvider router={router} />
      </CustomProvider>
  </React.StrictMode>
);
