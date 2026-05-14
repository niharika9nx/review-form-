/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'event@2026') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1, x: error ? [0, -10, 10, -10, 10, 0] : 0 }}
        className="glass-card w-full max-w-sm p-8 rounded-3xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <Lock className="text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold">Admin Portal</h2>
          <p className="text-text-muted text-sm">Enter the space-gate credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 pl-12 rounded-xl"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <User className="absolute left-4 top-4 text-text-muted" size={18} />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 pl-12 rounded-xl"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Lock className="absolute left-4 top-4 text-text-muted" size={18} />
          </div>

          {error && (
            <p className="text-ember text-center text-xs font-bold uppercase tracking-wider">
              Access Denied
            </p>
          )}

          <button
            type="submit"
            className="w-full p-4 rounded-xl gold-gradient-bg text-bg-deep font-bold"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
