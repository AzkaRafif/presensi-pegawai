import React, { useState } from 'react';
import {
  mysqlSchemaSQL,
  laravelMigration,
  laravelModels,
  laravelController,
} from '../../data/laravelTemplates';
import {
  X,
  Copy,
  Check,
  Download,
  Database,
  Code2,
  FileCode,
  Layers,
  Network,
  Server
} from 'lucide-react';

interface LaravelSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelSchemaModal: React.FC<LaravelSchemaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'migration' | 'models' | 'controller'>('erd');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'sql':
        return mysqlSchemaSQL;
      case 'migration':
        return laravelMigration;
      case 'models':
        return laravelModels;
      case 'controller':
        return laravelController;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const code = getActiveCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-bold shadow-md shadow-red-950">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Arsitektur Database MySQL & Laravel Framework
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 font-mono">
                  Schema: presensi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Struktur relasi tabel phpMyAdmin Designer, Migration Laravel 11/12, Eloquent Model, & Controller
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-slate-800 bg-slate-900 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('erd')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'erd'
                ? 'border-red-500 text-red-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Diagram Relasi (ERD Designer)</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-red-500 text-red-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>MySQL Schema DDL (SQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('migration')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'migration'
                ? 'border-red-500 text-red-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-rose-400" />
            <span>Laravel Migration</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'models'
                ? 'border-red-500 text-red-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Eloquent Models</span>
          </button>

          <button
            onClick={() => setActiveTab('controller')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'controller'
                ? 'border-red-500 text-red-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Laravel Controller</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 text-xs">
          {activeTab === 'erd' ? (
            /* Visual ERD matching phpMyAdmin screenshot */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-red-500" />
                  Struktur 6 Tabel Database MySQL Sesuai Tangkapan Layar:
                </h4>
                <p className="text-xs text-slate-400">
                  Relasi one-to-many (1:N) dan one-to-one (1:1) antara entitas <code className="text-red-300">pegawai</code> dengan <code className="text-red-300">users</code>, <code className="text-red-300">presensi</code>, dan <code className="text-red-300">ketidakhadiran</code>.
                </p>
              </div>

              {/* Grid 6 Tables matching screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. pegawai (Center) */}
                <div className="p-3.5 rounded-xl bg-slate-900 border-2 border-red-500/80 shadow-lg space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> pegawai
                    </span>
                    <span className="text-[10px] text-red-400 font-mono font-bold">PRIMARY ENTITY</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p># nrg : varchar(50)</p>
                    <p># nama : varchar(50)</p>
                    <p># jenis_kelamin : varchar(10)</p>
                    <p># alamat : varchar(225)</p>
                    <p># no_handphone : varchar(20)</p>
                    <p># jabatan : varchar(50)</p>
                    <p># lokasi_presensi : varchar(50)</p>
                    <p># foto : varchar(225)</p>
                  </div>
                </div>

                {/* 2. users */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> users
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">AUTH</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p className="text-blue-300 font-bold">🔗 id_pegawai : int(11) [FK]</p>
                    <p># username : varchar(50)</p>
                    <p># password : varchar(225)</p>
                    <p># status : varchar(20)</p>
                    <p># role : varchar(20)</p>
                  </div>
                </div>

                {/* 3. presensi */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> presensi
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">LOGS</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p className="text-blue-300 font-bold">🔗 id_pegawai : int(11) [FK]</p>
                    <p># tanggal_masuk : date</p>
                    <p># jam_masuk : time</p>
                    <p># foto_masuk : varchar(225)</p>
                    <p># tanggal_keluar : date</p>
                    <p># jam_keluar : time</p>
                    <p># foto_keluar : varchar(225)</p>
                  </div>
                </div>

                {/* 4. ketidakhadiran */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> ketidakhadiran
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">IZIN/CUTI</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p className="text-blue-300 font-bold">🔗 id_pegawai : int(11) [FK]</p>
                    <p># keterangan : varchar(50)</p>
                    <p># tanggal : date</p>
                    <p># deskripsi : varchar(225)</p>
                    <p># file : varchar(225)</p>
                    <p># status_pengajuan : varchar(20)</p>
                  </div>
                </div>

                {/* 5. lokasi_presensi */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> lokasi_presensi
                    </span>
                    <span className="text-[10px] text-red-400 font-mono">GEOFENCE</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p># nama_lokasi : varchar(50)</p>
                    <p># alamat_lokasi : varchar(225)</p>
                    <p># tipe_lokasi : varchar(50)</p>
                    <p># latitude : varchar(50)</p>
                    <p># longitude : varchar(50)</p>
                    <p># radius : int(11)</p>
                    <p># zona_waktu : varchar(4)</p>
                    <p># jam_masuk : time</p>
                    <p># jam_pulang : time</p>
                  </div>
                </div>

                {/* 6. jabatan */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> jabatan
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">MASTER</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <p className="font-bold text-amber-400">🔑 id : int(11) [PK]</p>
                    <p># jabatan : varchar(50)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Code View for SQL / Migration / Models / Controller */
            <div className="relative">
              <div className="sticky top-0 z-10 flex items-center justify-end gap-2 pb-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>

                <button
                  onClick={() => {
                    const filename =
                      activeTab === 'sql'
                        ? 'database_presensi.sql'
                        : activeTab === 'migration'
                        ? '2024_create_presensi_database_tables.php'
                        : activeTab === 'models'
                        ? 'Eloquent_Models.php'
                        : 'PresensiController.php';
                    handleDownload(filename, getActiveCode());
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{getActiveCode()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Database Connection: <code className="text-emerald-400">DB_CONNECTION=mysql; DB_DATABASE=presensi</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
