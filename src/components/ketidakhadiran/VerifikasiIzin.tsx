import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndoDate } from '../../utils/geoUtils';
import { Search, Check, X, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const VerifikasiIzin: React.FC = () => {
  const { pegawaiList, ketidakhadiranList, updateStatusKetidakhadiran, role } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    id: number;
    nama: string;
    jenis: string;
    action: 'Disetujui' | 'Ditolak';
  } | null>(null);

  const filteredList = ketidakhadiranList.filter((item) => {
    const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
    const matchesName = pegawai?.nama.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesKet = item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' ? true : item.status_pengajuan === filterStatus;
    return (matchesName || matchesKet) && matchesStatus;
  });

  const pendingCount = ketidakhadiranList.filter(k => k.status_pengajuan === 'Pending').length;
  const disetujuiCount = ketidakhadiranList.filter(k => k.status_pengajuan === 'Disetujui').length;
  const ditolakCount = ketidakhadiranList.filter(k => k.status_pengajuan === 'Ditolak').length;

  const handleConfirm = () => {
    if (!confirmDialog) return;
    updateStatusKetidakhadiran(confirmDialog.id, confirmDialog.action);
    setConfirmDialog(null);
  };

  const canApprove = role === 'Admin' || role === 'Operator';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {role === 'Operator' ? 'Data Perizinan Pegawai' : 'Verifikasi Izin & Cuti Pegawai'}
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          {role === 'Operator'
            ? 'Lihat dan konfirmasi permohonan ketidakhadiran seluruh pegawai'
            : 'Persetujuan permohonan ketidakhadiran pegawai'}
        </p>
      </div>

      {/* Statistik cepat */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-xs font-semibold text-amber-700 mt-0.5 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Menunggu
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-emerald-600">{disetujuiCount}</p>
          <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-rose-600">{ditolakCount}</p>
          <p className="text-xs font-semibold text-rose-700 mt-0.5 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Ditolak
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pegawai / jenis izin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-between sm:justify-start gap-0.5">
          {['Semua', 'Pending', 'Disetujui', 'Ditolak'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
              {st === 'Pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Tanggal Izin</th>
                <th className="py-3 px-4">Alasan & Lampiran</th>
                <th className="py-3 px-4">Status</th>
                {canApprove && <th className="py-3 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={canApprove ? 7 : 6} className="py-12 text-center text-slate-400">
                    Tidak ada data permohonan izin.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {(pegawai?.nama || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{pegawai?.nama || 'Pegawai'}</p>
                            <p className="text-[10px] text-slate-500">{pegawai?.jabatan || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {pegawai?.lokasi_presensi || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.keterangan === 'Sakit' ? 'bg-red-100 text-red-800'
                          : item.keterangan === 'Cuti' ? 'bg-blue-100 text-blue-800'
                          : item.keterangan === 'Dinas Luar' ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                        }`}>
                          {item.keterangan}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatIndoDate(item.tanggal)}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-slate-700 line-clamp-2">{item.deskripsi}</p>
                        {item.file && (
                          <span className="inline-block mt-1 text-[10px] text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            📎 {item.file}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status_pengajuan === 'Disetujui' ? 'bg-emerald-100 text-emerald-800'
                            : item.status_pengajuan === 'Ditolak' ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status_pengajuan}
                        </span>
                      </td>
                      {canApprove && (
                        <td className="py-3 px-4 text-right">
                          {item.status_pengajuan === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setConfirmDialog({
                                  id: item.id,
                                  nama: pegawai?.nama || 'Pegawai',
                                  jenis: item.keterangan,
                                  action: 'Disetujui',
                                })}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Setujui
                              </button>
                              <button
                                onClick={() => setConfirmDialog({
                                  id: item.id,
                                  nama: pegawai?.nama || 'Pegawai',
                                  jenis: item.keterangan,
                                  action: 'Ditolak',
                                })}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Selesai diproses</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Konfirmasi */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              {confirmDialog.action === 'Disetujui' ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {confirmDialog.action === 'Disetujui' ? 'Setujui Permohonan?' : 'Tolak Permohonan?'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Pegawai:</span>
                <span className="font-bold text-slate-900">{confirmDialog.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis:</span>
                <span className="font-bold text-slate-900">{confirmDialog.jenis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keputusan:</span>
                <span className={`font-bold ${confirmDialog.action === 'Disetujui' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {confirmDialog.action}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs transition-colors ${
                  confirmDialog.action === 'Disetujui'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Ya, {confirmDialog.action === 'Disetujui' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
