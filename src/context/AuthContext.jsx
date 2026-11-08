import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  subscribeUsers, 
  changeUserPin as storageChangePin, 
  updateUserRpgClass as storageUpdateClass,
  getLocalUsers 
} from '../lib/storage';

const AuthContext = createContext();

const LOCAL_SESSION_KEY = 'the_ranking_active_user_id';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => getLocalUsers());
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem(LOCAL_SESSION_KEY) || null;
  });
  const [loading, setLoading] = useState(true);

  // Subscribe to live users
  useEffect(() => {
    const unsub = subscribeUsers((updatedUsers) => {
      setUsers([...updatedUsers]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || null;

  const login = (username, pin) => {
    const found = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      return { success: false, message: 'Usuario no encontrado en la lista.' };
    }

    if (found.pin && found.pin !== pin.trim()) {
      return { success: false, message: 'Código PIN incorrecto.' };
    }

    setCurrentUserId(found.id);
    localStorage.setItem(LOCAL_SESSION_KEY, found.id);
    return { success: true, user: found };
  };

  const selectUserDirectly = (user) => {
    setCurrentUserId(user.id);
    localStorage.setItem(LOCAL_SESSION_KEY, user.id);
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  const changePin = async (newPin) => {
    if (!currentUser) return false;
    const ok = await storageChangePin(currentUser.id, newPin);
    if (ok) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, pin: newPin.trim() } : u));
    }
    return ok;
  };

  // Change RPG Class with instant state update
  const changeUserClass = async (rpgClass) => {
    if (!currentUser) return false;
    await storageUpdateClass(currentUser.id, rpgClass);
    
    // Immediately reflect in React state for instant UI update
    setUsers(prev => prev.map(u => u.id === currentUser.id ? {
      ...u,
      avatar: rpgClass.icon,
      rpgClassId: rpgClass.id,
      rpgClassName: rpgClass.name
    } : u));

    return true;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      currentUserId,
      isAdmin,
      loading,
      login,
      selectUserDirectly,
      logout,
      changePin,
      changeUserClass
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
