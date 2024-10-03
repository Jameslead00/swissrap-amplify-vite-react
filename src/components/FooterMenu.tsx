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
      padding: '10px 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
    }}>
      <Link to="/" style={iconStyle}>
        <Home />
      </Link>
      <Link to="/play" style={iconStyle}>
        <PlayArrow />
      </Link>
      <Link to="/account" style={iconStyle}>
        <Person />
      </Link>
      <Link to="/settings" style={iconStyle}>
        <Settings />
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
};


export default FooterMenu;
