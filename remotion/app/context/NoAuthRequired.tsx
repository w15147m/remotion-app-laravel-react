import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router';

interface NoAuthRequiredProps {
  children: React.ReactNode;
}


const NoAuthRequired: React.FC<NoAuthRequiredProps> = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Render public content (login page)
  return <>{children}</>;
};

export default NoAuthRequired;

