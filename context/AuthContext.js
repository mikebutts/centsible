'use client';

import { auth, db } from "@/firebaseClient";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth methods
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setCurrentUser(null);
    setSubscriptions([]);
    return signOut(auth);
  }

  // 🔄 Load subscriptions for the logged-in user
  async function fetchSubscriptions(userId) {
    try {
      const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubscriptions(subs);
    } catch (err) {
      console.error("Error loading subscriptions:", err.message);
    }
  }

  // ➕ Add a new subscription
  async function handleAddSubscription(newSubscription) {
    if (!currentUser || !currentUser.uid) {
      console.error("❌ No currentUser — can't save to Firestore");
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "subscriptions"), {
        ...newSubscription,
        userId: currentUser.uid,
        cost: parseFloat(newSubscription.cost),
        createdAt: new Date(),
      });
  
      setSubscriptions(prev => [...prev, { id: docRef.id, ...newSubscription }]);
      console.log("✅ Subscription added to Firestore:", docRef.id);
    } catch (err) {
      console.error("❌ Failed to save subscription:", err.message);
    }
  }
  

  // ✏️ Update an existing subscription
  async function handleUpdateSubscription(subscriptionId, updatedData) {
    try {
      const subRef = doc(db, "subscriptions", subscriptionId);
      await updateDoc(subRef, {
        ...updatedData,
        updatedAt: new Date(),
      });

      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, ...updatedData } : sub
        )
      );
    } catch (err) {
      console.error("Failed to update subscription:", err.message);
    }
  }

  // 🗑 Delete a subscription
  async function handleDeleteSubscription(subscriptionId) {
    try {
      await deleteDoc(doc(db, "subscriptions", subscriptionId));
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    } catch (err) {
      console.error("Failed to delete subscription:", err.message);
    }
  }

  // 👤 Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        setLoading(true);
        await fetchSubscriptions(user.uid);
        setLoading(false);
      } else {
        setSubscriptions([]);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    subscriptions,
    loading,
    signup,
    login,
    logout,
    handleAddSubscription,
    handleUpdateSubscription,
    handleDeleteSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
