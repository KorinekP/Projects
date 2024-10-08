import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  auth: {
    token: string | null;
    user: { name: string; email: string; role: string } | null;
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('jwtToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  });

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { name, email: userEmail, role, token } = response.data;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify({ name, userEmail, role }));

      setAuth({ token, user: { name, email: userEmail, role } });

      navigate('/profile');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');

    setAuth({ token: null, user: null });

    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
