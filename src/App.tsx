/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Starfield from './components/Starfield';
import ReviewForm from './components/ReviewForm';
import SuccessMessage from './components/SuccessMessage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Review } from './types';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginSequence, setLoginSequence] = useState('');
  const [footerClicks, setFooterClicks] = useState(0);

  // Load reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    const adminSession = sessionStorage.getItem('adminAuth');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }

    return () => unsubscribe();
  }, []);

  // Save reviews to localStorage
  const saveReviews = (newList: Review[]) => {
    setReviews(newList);
    localStorage.setItem('eventReviews', JSON.stringify(newList));
  };

  // Keyboard "ADMIN" detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (!/[A-Z]/.test(char) || char.length > 1) return;

      setLoginSequence(prev => {
        const next = (prev + char).slice(-5);
        if (next === 'ADMIN') {
          setShowLogin(true);
          return '';
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFooterClick = () => {
    setFooterClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowLogin(true);
        return 0;
      }
      return next;
    });
    // Reset clicks after 2 seconds of inactivity
    setTimeout(() => setFooterClicks(0), 2000);
  };

  const handleFormSubmit = async (data: Omit<Review, 'id' | 'timestamp'>) => {
    try {
      const newReview = {
        ...data,
        timestamp: Date.now()
      };
      await addDoc(collection(db, 'reviews'), newReview);
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('adminAuth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <Starfield />
      <div className="aurora" />

      <main className="relative z-10 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <AdminDashboard 
              reviews={reviews} 
              onDelete={deleteReview} 
              onLogout={handleAdminLogout} 
            />
          ) : submitted ? (
            <SuccessMessage key="success" />
          ) : (
            <ReviewForm key="form" onSubmit={handleFormSubmit} />
          )}
        </AnimatePresence>
      </main>

      {!isAdmin && (
        <footer className="fixed bottom-6 text-center z-10">
          <button 
            onClick={handleFooterClick}
            className="text-[10px] text-text-muted hover:text-text-primary transition-colors cursor-default select-none uppercase tracking-widest"
          >
            © Event 2025 • Memories of enlightmment
          </button>
        </footer>
      )}

      <AnimatePresence>
        {showLogin && (
          <AdminLogin 
            onLogin={handleAdminLogin} 
            onClose={() => setShowLogin(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
