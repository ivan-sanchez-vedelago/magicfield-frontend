'use client';

import React, { createContext, useReducer, useCallback, useEffect, ReactNode } from 'react';

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: number | '';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, lastName: string, email: string, phone: number | '', password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_SESSION'; payload: AuthUser }
  | { type: 'SESSION_INVALID' };

// Initial state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SESSION_INVALID':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          credentials: 'include', // Send cookies
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch({ type: 'RESTORE_SESSION', payload: userData });
        } else if (response.status === 401) {
          dispatch({ type: 'SESSION_INVALID' });
        }
      } catch (error) {
        dispatch({ type: 'SESSION_INVALID' });
      }
    };

    restoreSession();
  }, [API_URL]);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Allow cookies to be set
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error en el login');
        }

        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData });
        showSuccess(`¡Bienvenido ${userData.name}!`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [API_URL]
  );

  const register = useCallback(
    async (name: string, lastName: string, email: string, phone: number | '', password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, lastName, email, phone, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error en el registro');
        }

        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData });
        showSuccess('¡Registro exitoso!');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [API_URL]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      showSuccess('¡Hasta luego!');
    }
  }, [API_URL]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    successMessage,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
