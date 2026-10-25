import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on app launch
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('lms_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('lms_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('lms_token', newToken);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('lms_token', newToken);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
  };

  const updateUserProfile = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('lms_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
