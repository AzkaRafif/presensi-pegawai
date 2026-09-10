import React from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentDateStr, formatIndoDate, isLateCheckIn } from '../../utils/geoUtils';
import {
  Camera, CheckCircle2, Clock, MapPin, Calendar,
  FileText, ArrowRight, LogOut, LogIn
} from 'lucide-react';

export const PegawaiDashboard: React.FC = () => {
  const {
    currentPegawai, currentUser, presensiList, ketidakhadiranList,
    lokasiList, setActiveTab, getTodayPresensiForPegawai,
  } = useApp();

  const today = getCurrentDateStr();
  const todayPresensi = currentPegawai ? getTodayPresensiForPegawai(currentPegawai.id) : undefined;
  const assignedLokasi = lokasiList.find((l) => l.nama_lokasi === currentPegawai?.lokasi_presensi) || lokasiList[0];
  const myPresensiLogs = currentPegawai ? presensiList.filter((p) => p.id_pegawai === currentPegawai.id) : [];
  const myIzinLogs = currentPegawai ? ketidakhadiranList.filter((k) => k.id_pegawai === currentPegawai.id) : [];
  const hasAbsenMasuk = !!todayPresensi?.jam_masuk;
  const hasAbsenPulang = !!todayPresensi?.jam_keluar;
  const isLate = todayPresensi
    ? isLateCheckIn(todayPresensi.jam_masuk, assignedLokasi?.jam_masuk || '07:30:00')
    : false;

  // Inisial nama untuk avatar
  const namaDisplay = currentPegawai?.nama || currentUser?.username || 'P';
  const inisial = namaDisplay.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header Info Pegawai — tanpa foto profil, pakai avatar inisial */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-2xl shrink-0">
              {inisial}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Halo, {namaDisplay}!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentPegawai?.jabatan || 'Pegawai'} • NRG: <span className="font-mono text-slate-700">{currentPegawai?.nrg || '-'}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {currentPegawai?.lokasi_presensi || 'Kantor Pusat'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Jam Masuk: {assignedLokasi?.jam_masuk || '07:30'} WIB
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-quick-absen"
            onClick={() => setActiveTab('presensi-kamera')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>
              {!hasAbsenMasuk ? 'Presensi Masuk Sekarang' : !hasAbsenPulang ? 'Presensi Pulang Sekarang' : 'Lihat Presensi Hari Ini'}
            </span>
          </button>
        </div>
      </div>

      {/* Status Kehadiran Hari Ini */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status Masuk */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LogIn className="w-4 h-4 text-emerald-600" /> Presensi Masuk
            </span>
            {hasAbsenMasuk ? (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isLate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {isLate ? 'Terlambat' : 'Tepat Waktu'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Belum Masuk</span>
            )}
          </div>
          <div className="flex items-center gap-4 pt-1">
            {todayPresensi?.foto_masuk ? (
              <img src={todayPresensi.foto_masuk} alt="Foto Masuk" className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Camera className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900">{todayPresensi?.jam_masuk || '--:--:--'}</p>
              <p className="text-xs text-slate-500">
                {hasAbsenMasuk ? formatIndoDate(today) : 'Silakan ambil foto selfie di lokasi'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Pulang */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LogOut className="w-4 h-4 text-blue-600" /> Presensi Pulang
            </span>
            {hasAbsenPulang ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Selesai</span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Belum Pulang</span>
            )}
          </div>
          <div className="flex items-center gap-4 pt-1">
            {todayPresensi?.foto_keluar ? (
              <img src={todayPresensi.foto_keluar} alt="Foto Pulang" className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Camera className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900">{todayPresensi?.jam_keluar || '--:--:--'}</p>
              <p className="text-xs text-slate-500">
                {hasAbsenPulang ? 'Presensi pulang berhasil tercatat' : `Jam pulang: ${assignedLokasi?.jam_pulang || '16:00'} WIB`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat & Izin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" /> Riwayat Kehadiran Terakhir
            </h3>
            <button onClick={() => setActiveTab('riwayat-presensi')} className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Jam Masuk</th>
                  <th className="py-2.5 px-3">Jam Pulang</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myPresensiLogs.slice(0, 5).map((log) => {
                  const late = isLateCheckIn(log.jam_masuk, assignedLokasi?.jam_masuk || '07:30:00');
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-700">{formatIndoDate(log.tanggal_masuk)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{log.jam_masuk}</td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{log.jam_keluar || '-'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${late ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {late ? 'Terlambat' : 'Tepat Waktu'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" /> Izin & Cuti Saya
            </h3>
            <button onClick={() => setActiveTab('pengajuan-izin')} className="text-xs font-semibold text-red-600 hover:text-red-700">
              + Ajukan Izin
            </button>
          </div>
          <div className="space-y-2.5">
            {myIzinLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada permohonan izin/cuti.</p>
            ) : (
              myIzinLogs.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.keterangan}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status_pengajuan === 'Disetujui' ? 'bg-emerald-100 text-emerald-800'
                        : item.status_pengajuan === 'Ditolak' ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>{item.status_pengajuan}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{formatIndoDate(item.tanggal)}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{item.deskripsi}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
