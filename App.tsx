import { supabase } from './services/supabase'; // CORRIGIDO: Removido espaço extra
import React, { useState, useEffect, useCallback } from 'react';
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

// GRADE INICIAL LIMPA
const DEFAULT_CHANNELS: Channel[] = [];

const App: React.FC = () => {
  // Estado de Autenticação
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('nexstream_auth');
    return saved ? JSON.parse(saved) : { user: null, isAdmin: false, isAuthenticated: false };
  });

  // Estado dos Canais (Adicionado para evitar erro de 'channels is not defined')
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('nexstream_channels');
    return saved ? JSON.parse(saved) : DEFAULT_CHANNELS;
  });

  // Verificar sessão ativa ao carregar
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // Aqui você pode adicionar lógica para verificar se o ID do user é admin no seu banco
        setAuthState(prev => ({
          ...prev,
          user: data.user as any,
          isAuthenticated: true
        }));
      }
    };
    checkUser();
  }, []);

  // Persistência de Dados
  useEffect(() => {
    localStorage.setItem('nexstream_auth', JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem('nexstream_channels', JSON.stringify(channels));
  }, [channels]);

  // Sincronização entre abas
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isAdmin: false, isAuthenticated: false });
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white