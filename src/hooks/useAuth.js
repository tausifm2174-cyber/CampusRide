import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook: useAuth
 * Provides direct access to authentication state and actions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
