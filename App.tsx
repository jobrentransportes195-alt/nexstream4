import { supabase } from './services/supabase';
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Channel, AuthState } from './types';
import Login from './components/Login';
import Home from './components/Home';
import Player from './components/Player';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import PlaylistManager from './components/Admin/PlaylistManager';
import ChannelManagement from './components/Admin/ChannelManagement';

const DEFAULT_CHANNELS: Channel[] = [];

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('nexstream_auth');
    return saved
      ? JSON.parse(saved)
      : { user: null, isAdmin: false, isAuthenticated: false };
  });

  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('nexstream_channels');
    return saved ? JSON.parse(saved) : DEFAULT_CHANNELS;
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setAuthState(prev => ({
          ...prev,
          user: data.user as any,
          isAuthenticated: true,
        }));
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
    setAuthState({ user, isAdmin, isAuthenticated: true });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isAdmin: false, isAuthenticated: false });
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          {!authState.isAuthenticated ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              <Route
                path="/"
                element={
                  <Home
                    channels={channels}
                    onLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/player/:id"
                element={<Player channels={channels} />}
              />

              {authState.isAdmin && (
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="playlists" element={<PlaylistManager />} />
                  <Route path="channels" element={<ChannelManagement />} />
                </Route>
              )}

              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
