import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Camera,
  CalendarCheck,
  FileText,
  Users,
  MapPin,
  Shield,
  FileSpreadsheet,
  Database,
  Eye,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLaravelModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenLaravelModal }) => {
  const { activeTab, setActiveTab, role, pendingIzinCount } = useApp();

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const navItemClass = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-red-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
              SP
            </span>
            <span>SIMPRESENSI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Operator Navigation — lihat presensi + perizinan */}
          {role === 'Operator' && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menu Operator
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('rekap-presensi')}
                  className={navItemClass('rekap-presensi')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Riwayat Presensi</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('verifikasi-izin')}
                  className={navItemClass('verifikasi-izin')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Perizinan Pegawai</span>
                  </div>
                  {pendingIzinCount > 0 && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingIzinCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Pegawai Navigation */}
          {role === 'Pegawai' && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menu Pegawai
              </div>
              <div className="space-y-1">
                <button
                  id="nav-dashboard"
                  onClick={() => handleNav('dashboard')}
                  className={navItemClass('dashboard')}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>

                <button
                  id="nav-presensi-kamera"
                  onClick={() => handleNav('presensi-kamera')}
                  className={navItemClass('presensi-kamera')}
                >
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4" />
                    <span>Presensi Masuk / Pulang</span>
                  </div>
                </button>

                <button
                  id="nav-pengajuan-izin"
                  onClick={() => handleNav('pengajuan-izin')}
                  className={navItemClass('pengajuan-izin')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Izin & Cuti</span>
                  </div>
                </button>

                <button
                  id="nav-riwayat-presensi"
                  onClick={() => handleNav('riwayat-presensi')}
                  className={navItemClass('riwayat-presensi')}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Riwayat Kehadiran</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Admin Navigation */}
          {role === 'Admin' && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menu Administrator
              </div>
              <div className="space-y-1">
                <button
                  id="nav-dashboard"
                  onClick={() => handleNav('dashboard')}
                  className={navItemClass('dashboard')}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>

                <button
                  id="nav-rekap-presensi"
                  onClick={() => handleNav('rekap-presensi')}
                  className={navItemClass('rekap-presensi')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Rekap Presensi</span>
                  </div>
                </button>

                <button
                  id="nav-verifikasi-izin"
                  onClick={() => handleNav('verifikasi-izin')}
                  className={navItemClass('verifikasi-izin')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Perizinan Pegawai</span>
                  </div>
                  {pendingIzinCount > 0 && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingIzinCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-pegawai-jabatan"
                  onClick={() => handleNav('pegawai-jabatan')}
                  className={navItemClass('pegawai-jabatan')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Pegawai & Jabatan</span>
                  </div>
                </button>

                <button
                  id="nav-data-lokasi"
                  onClick={() => handleNav('data-lokasi')}
                  className={navItemClass('data-lokasi')}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Lokasi & Jam Kerja</span>
                  </div>
                </button>

                <button
                  id="nav-data-users"
                  onClick={() => handleNav('data-users')}
                  className={navItemClass('data-users')}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4" />
                    <span>Akun Pengguna</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Database Quick Button at Footer */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={onOpenLaravelModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-red-600" />
            <span>Skema Database MySQL</span>
          </button>
        </div>
      </aside>
    </>
  );
};
