/**
 * Admin Login Page
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/hooks';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  // Check Firebase config on mount
  useState(() => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!apiKey || !projectId) {
      setConfigError(true);
      console.error('❌ Firebase config tidak lengkap!');
      console.error('Silakan isi .env.local dengan credentials dari Firebase Console');
    }
  });

  // Redirect if already logged in
  if (user) {
    router.push('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Login gagal. Periksa email dan password Anda.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Config Error Warning */}
          {configError && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-700 text-2xl flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-yellow-900 text-lg mb-2">Firebase Config Tidak Lengkap</h3>
                  <p className="text-base text-yellow-800 font-medium">
                    Silakan isi file <code className="bg-yellow-200 px-2 py-1 rounded font-mono">.env.local</code> dengan credentials dari Firebase Console.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2 font-semibold">
                    Lihat panduan: <strong className="underline">FIREBASE_SETUP.md</strong> atau <strong className="underline">QUICK_START.md</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaSignInAlt className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-black mb-2">Admin Login</h1>
            <p className="text-black text-lg font-medium">Masuk untuk mengelola undangan</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-lg"
            >
              <p className="text-red-700 text-base font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-base font-bold text-black mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-600 text-lg" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={configError}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 text-black font-medium"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-base font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-600 text-lg" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={configError}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 text-black font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || configError}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-lg text-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-5 bg-emerald-50 rounded-lg border-2 border-emerald-300">
            <p className="text-base text-black mb-3 font-bold">📋 Cara Setup:</p>
            <ol className="text-sm text-black space-y-2 list-decimal list-inside font-medium">
              <li>Buka Firebase Console</li>
              <li>Buat project dan enable Authentication</li>
              <li>Buat user admin di Authentication → Users</li>
              <li>Copy Firebase config ke .env.local</li>
              <li>Refresh halaman ini</li>
            </ol>
            <p className="text-sm text-black mt-4 font-bold">
              📖 Lihat: <strong className="underline">QUICK_START.md</strong> untuk panduan lengkap
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
