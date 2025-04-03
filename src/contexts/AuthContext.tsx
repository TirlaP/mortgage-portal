import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define user roles enum
export enum UserRole {
  ADMIN = 'Admin',
  LOAN_OFFICER = 'LO',
  LOAN_OFFICER_ASSISTANT = 'LOA',
}

// Export USER_ROLES for compatibility with existing components
export const USER_ROLES = UserRole;

// Define user interface
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar: string | null;
}

// Define mock user interface including password for authentication
interface MockUser extends User {
  password: string;
}

// Define authentication context interface
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  loading: boolean;
}

// Define props for the auth provider
interface AuthProviderProps {
  children: ReactNode;
}

// Sample mock users for the MVP
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    email: 'admin@mortgage.com',
    password: 'admin123',
    name: 'Admin User',
    role: UserRole.ADMIN,
    avatar: null,
  },
  {
    id: 2,
    email: 'lo@mortgage.com',
    password: 'lo123',
    name: 'Loan Officer',
    role: UserRole.LOAN_OFFICER,
    avatar: null,
  },
  {
    id: 3,
    email: 'loa@mortgage.com',
    password: 'loa123',
    name: 'Loan Officer Assistant',
    role: UserRole.LOAN_OFFICER_ASSISTANT,
    avatar: null,
  },
];

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in local storage on initial load
    const savedUser = localStorage.getItem('mortgagePortalUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email: string, password: string): boolean => {
    // Find user with matching credentials
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Create a safe user object (excluding password)
      const safeUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      };

      // Save to state and local storage
      setCurrentUser(safeUser);
      localStorage.setItem('mortgagePortalUser', JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('mortgagePortalUser');
  };

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return currentUser?.role === role;
  };

  // Check if user has admin permissions
  const isAdmin = (): boolean => {
    return currentUser?.role === UserRole.ADMIN;
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    hasRole,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};