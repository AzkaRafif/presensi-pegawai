import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => { success: boolean; message: string };
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = onLogin(username.trim(), password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
            SP
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SIMPRESENSI</h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Informasi Presensi Pegawai</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-500 mt-0.5">Gunakan akun yang sudah terdaftar</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk'}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2026 SIMPRESENSI — Sistem Informasi Presensi Pegawai
        </p>
      </div>
    </div>
  );
};
