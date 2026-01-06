import { useState, useEffect } from 'react';
import { boltDb } from '../lib/database';

interface User {
  id: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from Bolt database
    const currentUser = boltDb.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = await boltDb.signUp(email, password, fullName);
    if (result.data.user) {
      setUser(result.data.user);
    }
    return { data: result.data, error: result.error };
  };

  const signIn = async (email: string, password: string) => {
    const result = await boltDb.signIn(email, password);
    if (result.data.user) {
      setUser(result.data.user);
    }
    return { data: result.data, error: result.error };
  };

  const signOut = async () => {
    const result = await boltDb.signOut();
    setUser(null);
    return { error: result.error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}