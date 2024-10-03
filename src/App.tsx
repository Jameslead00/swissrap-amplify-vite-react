import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Layout from './components/Layout';
import WordlistPage from './pages/WordlistPage';
import PlayPage from './pages/PlayPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import CreateListPage from './pages/CreateListPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6337bf',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Authenticator>
        {() => (
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<WordlistPage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/create-list" element={<CreateListPage />} />
              </Routes>
            </Layout>
          </Router>
        )}
      </Authenticator>
    </ThemeProvider>
  );
};

export default App;
