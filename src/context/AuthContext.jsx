import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

export const DEFAULT_USERS = [
  {
    id: 'u-1',
    name: 'Tausif M',
    email: 'tausif@example.com',
    password: '123456',
    role: 'STUDENT',
    course: 'Computer Science Engineering',
    year: '2nd Year',
    studentId: '1JB24CS230',
    phone: '+91 98765 43210',
    college: 'SJB Institute of Technology',
    vehicle: 'Maruti Suzuki Swift (White) • KA 05 MC 3321',
    rating: 4.8,
    avatar: '/assets/student-driver.jpg',
    ridesCompleted: 14
  },
  {
    id: 'u-2',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: '123456',
    role: 'STUDENT',
    course: 'Information Science',
    year: '3rd Year',
    studentId: '1JB23IS045',
    phone: '+91 98450 11223',
    college: 'SJB Institute of Technology',
    vehicle: 'Honda City (White) • KA 04 MP 4219',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    ridesCompleted: 24
  }
];

export function AuthProvider({ children }) {
  // Persistent list of registered users
  const [users, setUsers] = useLocalStorage('campusride_users', DEFAULT_USERS);

  // Persistent currently authenticated user
  const [user, setUser] = useLocalStorage('campusride_current_user', DEFAULT_USERS[0]);

  const isAuthenticated = Boolean(user);

  /**
   * Log in user by matching email and password
   */
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (existing) {
      setUser(existing);
      return { success: true, user: existing };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  /**
   * Register a new student user and immediately log them in
   */
  const register = (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: 'STUDENT',
      course: userData.course || 'Computer Science Engineering',
      year: userData.year || '2nd Year',
      studentId: userData.studentId?.trim() || `1JB24CS${Math.floor(100 + Math.random() * 900)}`,
      phone: userData.phone || '+91 98765 43210',
      college: userData.college || 'SJB Institute of Technology',
      vehicle: userData.vehicle || 'Personal Student Vehicle',
      rating: 5.0,
      avatar: '/assets/student-driver.jpg',
      ridesCompleted: 0
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  /**
   * Log out currently authenticated user
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Update current user profile and sync to user registry
   */
  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const contextValue = {
    user,
    isAuthenticated,
    users,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
