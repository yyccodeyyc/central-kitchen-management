import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // 检查本地存储中的认证信息
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null,
        });
      } catch (error) {
        // 清除无效数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (user: User) => {
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      isAuthenticated: true,
      user,
      token,
      loading: false,
      error: null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!authState.user) return false;

    // 管理员拥有所有权限
    if (authState.user.role === 'ADMIN') return true;

    // 检查用户权限列表
    return authState.user.permissions.some(permission =>
      (permission.resource === '*' || permission.resource === resource) &&
      (permission.action === 'MANAGE' || permission.action === action)
    );
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
