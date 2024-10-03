import React from 'react';
import { Link } from 'react-router-dom';

const FooterMenu: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/">Wordlists</Link>
      <Link to="/play">Play</Link>
      <Link to="/account">Account</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
};

export default FooterMenu;
