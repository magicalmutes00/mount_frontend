import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AdminApi from '../../api/adminApi';

interface ShrineAuthContextType {
  isAuthenticated: boolean;
  admin: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  verifyToken: () => Promise<boolean>;
}

const ShrineAuthContext = createContext<ShrineAuthContextType | undefined>(undefined);

export const ShrineAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AdminApi.isAuthenticated()) {
          const isValid = await verifyToken();
          if (isValid) {
            setIsAuthenticated(true);
            setAdmin(AdminApi.getCurrentAdmin());
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await AdminApi.login({ username, password });
      
      if (response.success) {
        setIsAuthenticated(true);
        setAdmin(response.data.admin);
        return true;
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await AdminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setAdmin(null);
      setLoading(false);
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const response = await AdminApi.verifyToken();
      if (response.success) {
        setAdmin(response.data.admin);
        return true;
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setIsAuthenticated(false);
      setAdmin(null);
      return false;
    }
  };

  return (
    <ShrineAuthContext.Provider value={{ 
      isAuthenticated, 
      admin, 
      login, 
      logout, 
      loading,
      verifyToken 
    }}>
      {children}
    </ShrineAuthContext.Provider>
  );
};

export const useShrineAuth = () => {
  const context = useContext(ShrineAuthContext);
  if (context === undefined) {
    throw new Error('useShrineAuth must be used within a ShrineAuthProvider');
  }
  return context;
};
