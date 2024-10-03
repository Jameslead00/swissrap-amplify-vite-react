import React, { ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import FooterMenu from './FooterMenu';
import { ExitToApp } from '@mui/icons-material';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
    }}>
      <header style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 1000,
      }}>
        <ExitToApp 
          onClick={handleSignOut}
          style={{
            cursor: 'pointer',
            color: '#262626',
            fontSize: '24px',
            marginRight: '1px',
          }}
        />
      </header>
      <main style={{
        flex: 1,
        overflow: 'auto',
      }}>
        {children || <Outlet />}
      </main>
      <FooterMenu />
    </div>
  );
};
export default Layout;