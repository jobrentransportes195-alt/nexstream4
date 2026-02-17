
export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  category: string;
  groupTitle?: string;
  useProxy?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  credits: number;
}

export interface Playlist {
  id: string;
  name: string;
  url?: string;
  rawContent?: string;
  channelsCount: number;
  lastUpdated: string;
}

export enum AppRoute {
  HOME = 'home',
  PLAYER = 'player',
  ADMIN_DASHBOARD = 'admin-dashboard',
  ADMIN_USERS = 'admin-users',
  ADMIN_PLAYLISTS = 'admin-playlists',
  LOGIN = 'login'
}

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
}
