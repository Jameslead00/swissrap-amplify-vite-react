import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css";
import Layout from "./components/Layout";
import PlayPage from "./pages/PlayPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import WordlistPage from "./pages/WordlistPage";
import CreateListPage from './pages/CreateListPage';

const LoadingScreen: React.FC = () => (
  <div>Loading...</div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            isLoading ? <LoadingScreen /> : <Navigate to="/wordlist" replace />
          } />
          <Route path="wordlist" element={<WordlistPage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/create-list" element={<CreateListPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;