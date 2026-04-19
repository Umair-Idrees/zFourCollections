import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Github, Chrome } from 'lucide-react';
import { signInWithGoogle, loginAsDemoUser, loginAsDemoAdmin } from '../lib/firebase';
import { User, ShieldCheck } from 'lucide-react';

import Logo from './Logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-primary"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                  <Logo variant="dark" className="scale-150" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-gray-500">Login to your account</p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                    <a href="#" className="text-xs font-bold text-accent hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 mt-4">
                  Sign In
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Chrome size={18} className="text-red-500" />
                  {isLoading ? 'Connecting...' : 'Google'}
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-sm">
                  <Github size={18} />
                  GitHub
                </button>
              </div>

              {/* Demo / Bypass Section */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Development Mode (Skip Auth)</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { loginAsDemoAdmin(); onClose(); }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all font-bold text-xs"
                  >
                    <ShieldCheck size={14} /> Demo Admin
                  </button>
                  <button 
                    onClick={() => { loginAsDemoUser(); onClose(); }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-bold text-xs"
                  >
                    <User size={14} /> Demo User
                  </button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-10">
                Don't have an account?{' '}
                <a href="#" className="text-accent font-bold hover:underline">Create Account</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
