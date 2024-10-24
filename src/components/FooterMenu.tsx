import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlayArrow, Person, Settings } from '@mui/icons-material';

const FooterMenu: React.FC = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderTop: '1px solid #dbdbdb',
      padding: '16px 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px'
    }}>
      <Link to="/" style={iconStyle}>
        <Home sx={{ fontSize: 36 }} />
      </Link>
      <Link to="/play" style={iconStyle}>
        <PlayArrow sx={{ fontSize: 36 }} />
      </Link>
      <Link to="/account" style={iconStyle}>
        <Person sx={{ fontSize: 36 }} />
      </Link>
      <Link to="/settings" style={iconStyle}>
        <Settings sx={{ fontSize: 36 }} />
      </Link>
    </nav>
  );
};

const iconStyle = {
  color: '#262626',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  padding: '8px 20px',
};

export default FooterMenu;
