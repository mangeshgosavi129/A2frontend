"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, userApi, setAuthToken, removeAuthToken } from '@/lib/api';
import { UserLogin, UserCreate, User } from '@/lib/types';
import { toast } from 'sonner';
import { DEMO_USERS, DEMO_CREDENTIALS } from '@/lib/mock-data';

// Demo mode flag - set to true to use mock data
const DEMO_MODE = true;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: UserLogin) => Promise<void>;
  signup: (data: UserCreate) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user_data');
      
      if (token) {
        setAuthToken(token);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: UserLogin) => {
    try {
      setIsLoading(true);
      
      if (DEMO_MODE) {
        // Demo mode - use mock data
        const demoUser = DEMO_USERS.find(u => u.phone === data.phone && u.password === data.password);
        
        if (!demoUser) {
          throw new Error('Invalid credentials');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockToken = `demo_token_${demoUser.id}`;
        setAuthToken(mockToken);
        setUser(demoUser as any);
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        toast.success(`Welcome back, ${demoUser.name}!`);
        router.push('/dashboard');
        return;
      }
      
      // Real API mode
      const response = await authApi.login(data);
      const { access_token } = response.data;
      setAuthToken(access_token);
      
      const usersResponse = await userApi.getAll();
      const foundUser = usersResponse.data.find((u: any) => u.phone === data.phone);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user_data', JSON.stringify(foundUser));
        toast.success('Logged in successfully');
        router.push('/dashboard');
      } else {
        throw new Error('User details not found');
      }
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || error.response?.data?.detail || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: UserCreate) => {
    try {
      setIsLoading(true);
      
      if (DEMO_MODE) {
        // Demo mode - create new mock user
        const newUser = {
          id: DEMO_USERS.length + 1,
          name: data.name,
          phone: data.phone,
          password: data.password,
          department: data.department || 'General',
          role: 'User',
          created_at: new Date().toISOString()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockToken = `demo_token_${newUser.id}`;
        setAuthToken(mockToken);
        setUser(newUser as any);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        toast.success('Account created successfully!');
        router.push('/dashboard');
        return;
      }
      
      // Real API mode
      const response = await authApi.signup(data);
      const { access_token } = response.data;
      setAuthToken(access_token);
      
      const usersResponse = await userApi.getAll();
      const foundUser = usersResponse.data.find((u: any) => u.phone === data.phone);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user_data', JSON.stringify(foundUser));
        toast.success('Account created successfully');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || error.response?.data?.detail || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (!DEMO_MODE) {
      authApi.logout().catch(() => {});
    }
    removeAuthToken();
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/login');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};