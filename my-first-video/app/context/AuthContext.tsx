import React, { createContext, useState, useEffect, ReactNode } from 'react';


interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  two_factor_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; 
}

interface AuthResponse {
  token: string;
  authUser?: User;  
  user?: User;     
  status?: number;
  message?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (authData: AuthResponse) => void; 
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { }, 
  logout: () => { },
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

// ================================
// ✅ Auth Provider Component
// ================================
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in (on app load)
    const authInfoStr = localStorage.getItem('authInfo');
    if (authInfoStr) {
      try {
        const authInfo: AuthResponse = JSON.parse(authInfoStr);
        // Handle different API response formats
        const userData = authInfo.authUser || authInfo.user;

        if (userData) {
          setUser(userData);
        } else {
          console.warn('AuthContext: No user data found in authInfo');
        }
      } catch (error) {
        console.error('AuthContext: Error parsing auth info:', error);
        localStorage.removeItem('authInfo');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (authData: AuthResponse) => {
    localStorage.setItem('authInfo', JSON.stringify(authData));

    const userData = authData.authUser || authData.user;

    if (userData) {
      setUser(userData);
    } else {
      console.warn('AuthContext: No user data in login response');
    }
  };

  const logout = () => {
    localStorage.removeItem('authInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};