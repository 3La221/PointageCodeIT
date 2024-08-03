import { useNavigate } from 'react-router-dom';
import { getUser } from '../../helpers/actions';
import React, { useEffect } from 'react';



const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
      console.log('User:', user); // Debugging line
      if (!user) {
          navigate('/login');
      }
  }, [user, navigate]);

  if (!user) {
      return null; // or a loading spinner
  }

  return children;
}


export default ProtectedRoute;
