  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { auth } from './firebase';
  import { signInWithEmailAndPassword, onAuthStateChanged, signOut,} from 'firebase/auth';

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
      await signOut(auth);
      setUser(null);
    };

    return (
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {!loading && children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);

