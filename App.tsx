import { supabase } from ' ./services/supabase';
import React, { useState, useEffect, useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppRoute, User, Channel, AuthState } from './types';
import Login from './components/Login';
import Home from './components/Home';
import Player from './components/Player';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import PlaylistManager from './components/Admin/PlaylistManager';
import ChannelManagement from './components/Admin/ChannelManagement';

// GRADE INICIAL LIMPA: Removidos canais pré-definidos para permitir apenas listas do usuário.
const DEFAULT_CHANNELS: Channel[] = [];

const App: React.FC = () => {
  

  const [authState, setAuthState] = useState<AuthState>({
  user: null,
  isAdmin: false,
  isAuthenticated: false
});

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setAuthState({
        user: data.user,
        isAdmin: false,
        isAuthenticated: true
      });
    }
  };

  checkUser();
}, []);

  useEffect(() => {
    localStorage.setItem('nexstream_auth', JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem('nexstream_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    const syncChannels = () => {
      const saved = localStorage.getItem('nexstream_channels');
      if (saved) setChannels(JSON.parse(saved));
    };
    window.addEventListener('storage', syncChannels);
    return () => window.removeEventListener('storage', syncChannels);
  }, []);

  const handleLogin = (user: User, isAdmin: boolean) => {
    const now = new Date();
    const expiry = new Date(user.expiresAt);
    if (!isAdmin && now > expiry) {
      alert('Sua conta expirou. Entre em contato com o administrador.');
      return;
    }
    setAuthState({ user, isAdmin, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAdmin: false, isAuthenticated: false });
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
        <Routes>
          <Route 
            path="/" 
            element={
              !authState.isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : authState.isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Home channels={channels} onLogout={handleLogout} />
              )
            } 
          />
          
          <Route 
            path="/player/:channelId" 
            element={
              authState.isAuthenticated ? (
                <Player channels={channels} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

          <Route 
            path="/admin/*" 
            element={
              authState.isAuthenticated && authState.isAdmin ? (
                <AdminLayout onLogout={handleLogout}>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="channels" element={<ChannelManagement />} />
                    <Route path="playlists" element={<PlaylistManager onChannelsUpdate={setChannels} />} />
                  </Routes>
                </AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
