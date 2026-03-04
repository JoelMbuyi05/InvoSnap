// lib/context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { toast } from 'sonner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // ✅ FIX: Check if user document exists, create if not
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // User document doesn't exist, create it
          console.log('Creating missing user document for:', user.uid);
          const newUserData = {
            email: user.email,
            businessName: user.displayName || 'My Business',
            nextInvoiceNumber: 1,
            createdAt: new Date().toISOString()
          };
          
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, businessName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // ✅ FIX: Create user document with proper structure
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const newUserData = {
        email,
        businessName,
        nextInvoiceNumber: 1,
        invoicePrefix: 'INV',
        currency: 'USD',
        taxRate: 0,
        defaultNotes: 'Thank you for your business!',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(userDocRef, newUserData);
      
      toast.success('Account created successfully!');
      return userCredential.user;
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // ✅ FIX: Check if user document exists after login
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create missing user document
        const newUserData = {
          email: result.user.email,
          businessName: 'My Business',
          nextInvoiceNumber: 1,
          invoicePrefix: 'INV',
          currency: 'USD',
          taxRate: 0,
          defaultNotes: 'Thank you for your business!',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newUserData);
      }
      
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const value = {
    user,
    userData,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}