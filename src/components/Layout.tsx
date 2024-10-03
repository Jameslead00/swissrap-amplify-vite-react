import React from 'react';
import { Outlet } from 'react-router-dom';
import FooterMenu from './FooterMenu';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <FooterMenu />
    </div>
  );
};

export default Layout;