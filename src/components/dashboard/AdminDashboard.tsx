import React from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentDateStr, formatIndoDate, isLateCheckIn } from '../../utils/geoUtils';
import {
  Users,
  UserCheck,
  ClockAlert,
  CheckCircle2,
  ArrowUpRight,
  UserX,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { pegawaiList, presensiList, lokasiList, setActiveTab } = useApp();

  const today = getCurrentDateStr();
  const todayPresensi = presensiList.filter((p) => p.tanggal_masuk === today);
  const totalPegawai = pegawaiList.length;
  const hadirCount = todayPresensi.length;
  const lokasiMain = lokasiList[0];
  const targetJamMasuk = lokasiMain?.jam_masuk || '07:30:00';
  const terlambatList = todayPresensi.filter((p) => isLateCheckIn(p.jam_masuk, targetJamMasuk));
  const tepatWaktuCount = hadirCount - terlambatList.length;
  const hadirPercentage = totalPegawai > 0 ? Math.round((hadirCount / totalPegawai) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Kartu Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pegawai</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalPegawai}</span>
            <span className="text-xs text-slate-500">orang terdaftar</span>
          </div>
          <button
            onClick={() => setActiveTab('pegawai-jabatan')}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Kelola Pegawai & Jabatan <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hadir Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{hadirCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{hadirPercentage}%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${hadirPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tepat Waktu</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{tepatWaktuCount}</span>
            <span className="text-xs text-slate-500">pegawai</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Masuk sebelum {targetJamMasuk}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Terlambat</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{terlambatList.length}</span>
            <span className="text-xs text-slate-500">pegawai</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Lewat batas toleransi jam masuk</p>
        </div>
      </div>

      {/* Tabel Kehadiran Hari Ini */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Log Kehadiran Hari Ini ({formatIndoDate(today)})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring presensi masuk & pulang pegawai di {lokasiMain?.nama_lokasi || 'Kantor Utama'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('rekap-presensi')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>Buka Rekapitulasi Lengkap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Foto Masuk</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Foto Pulang</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayPresensi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Belum ada catatan presensi yang masuk hari ini.
                  </td>
                </tr>
              ) : (
                todayPresensi.map((pres) => {
                  const pegawai = pegawaiList.find((p) => p.id === pres.id_pegawai);
                  const late = isLateCheckIn(pres.jam_masuk, targetJamMasuk);
                  return (
                    <tr key={pres.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar inisial — tidak pakai foto profil */}
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                            {(pegawai?.nama || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{pegawai?.nama || 'Pegawai'}</p>
                            <p className="text-[10px] text-slate-500 font-mono">NRG: {pegawai?.nrg || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{pegawai?.jabatan || '-'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{pres.jam_masuk}</td>
                      <td className="py-3 px-4">
                        {pres.foto_masuk ? (
                          <img src={pres.foto_masuk} alt="Selfie Masuk" className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200" />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{pres.jam_keluar || '-'}</td>
                      <td className="py-3 px-4">
                        {pres.foto_keluar ? (
                          <img src={pres.foto_keluar} alt="Selfie Pulang" className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200" />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${late ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {late ? 'Terlambat' : 'Tepat Waktu'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
