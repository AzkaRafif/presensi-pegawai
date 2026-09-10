/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PegawaiDashboard } from './components/dashboard/PegawaiDashboard';
import { PresensiCamera } from './components/presensi/PresensiCamera';
import { RiwayatPresensi } from './components/presensi/RiwayatPresensi';
import { PengajuanIzin } from './components/ketidakhadiran/PengajuanIzin';
import { VerifikasiIzin } from './components/ketidakhadiran/VerifikasiIzin';
import { PegawaiJabatanDashboard } from './components/pegawai/PegawaiJabatanDashboard';
import { LokasiList } from './components/master/LokasiList';
import { UsersList } from './components/master/UsersList';
import { RekapPresensi } from './components/laporan/RekapPresensi';
import { LaravelSchemaModal } from './components/developer/LaravelSchemaModal';
import { LoginPage } from './components/auth/LoginPage';

const MainLayout: React.FC = () => {
  const { activeTab, role, isLoggedIn, login } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [laravelModalOpen, setLaravelModalOpen] = useState(false);

  // Tampilkan halaman login jika belum masuk
  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onOpenLaravelModal={() => setLaravelModalOpen(true)}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenLaravelModal={() => setLaravelModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            role === 'Admin' ? <AdminDashboard />
            : role === 'Operator' ? <RekapPresensi />
            : <PegawaiDashboard />
          )}
          {activeTab === 'presensi-kamera' && role === 'Pegawai' && <PresensiCamera />}
          {activeTab === 'riwayat-presensi' && (role === 'Pegawai' ? <RiwayatPresensi /> : <RekapPresensi />)}
          {activeTab === 'pengajuan-izin' && role === 'Pegawai' && <PengajuanIzin />}
          {activeTab === 'verifikasi-izin' && (role === 'Admin' || role === 'Operator') && <VerifikasiIzin />}
          {(activeTab === 'pegawai-jabatan' || activeTab === 'data-pegawai' || activeTab === 'data-jabatan') && role === 'Admin' && (
            <PegawaiJabatanDashboard />
          )}
          {activeTab === 'data-lokasi' && role === 'Admin' && <LokasiList />}
          {activeTab === 'data-users' && role === 'Admin' && <UsersList />}
          {activeTab === 'rekap-presensi' && (role === 'Admin' || role === 'Operator') && <RekapPresensi />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-8 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">SIMPRESENSI</span>
          <span>•</span>
          <span>Sistem Informasi Presensi Pegawai</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => setLaravelModalOpen(true)}
            className="text-red-600 hover:underline font-semibold"
          >
            Lihat Kode Laravel & DDL SQL
          </button>
        </div>
      </footer>

      {/* Developer Architecture & MySQL Modal */}
      <LaravelSchemaModal
        isOpen={laravelModalOpen}
        onClose={() => setLaravelModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
