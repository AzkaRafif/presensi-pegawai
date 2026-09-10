import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldCheck, User, Menu, LogOut, Eye } from 'lucide-react';

interface NavbarProps {
  onOpenLaravelModal: () => void;
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLaravelModal, toggleSidebar }) => {
  const { role, currentUser, currentPegawai, logout } = useApp();

  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar dari sistem?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & App Title */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              SP
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                SIMPRESENSI
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Sistem Presensi Pegawai
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span className="text-slate-600">{dateStr}</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono font-bold text-slate-900">{time} WIB</span>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Info */}
          <div className="flex items-center gap-2.5">
            {/* Avatar inisial */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${role === 'Admin' ? 'bg-red-600' : role === 'Operator' ? 'bg-purple-600' : 'bg-blue-600'}`}>
              {(currentPegawai?.nama || currentUser?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {currentPegawai?.nama || currentUser?.username}
              </p>
              <p className="text-[10px] leading-tight flex items-center gap-1">
                {role === 'Admin' ? (
                  <span className="flex items-center gap-0.5 text-red-600 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Administrator
                  </span>
                ) : role === 'Operator' ? (
                  <span className="flex items-center gap-0.5 text-purple-600 font-semibold">
                    <Eye className="w-3 h-3" /> Operator
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                    <User className="w-3 h-3" /> {currentPegawai?.jabatan || 'Pegawai'}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold text-xs border border-slate-200 hover:border-red-200 transition-all"
            title="Keluar dari sistem"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
