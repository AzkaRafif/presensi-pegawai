import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentDateStr, formatIndoDate } from '../../utils/geoUtils';
import { FileText, Send, CheckCircle, Clock, XCircle } from 'lucide-react';

export const PengajuanIzin: React.FC = () => {
  const { currentPegawai, currentUser, ketidakhadiranList, submitKetidakhadiran } = useApp();

  const [keterangan, setKeterangan] = useState<'Izin' | 'Sakit' | 'Cuti' | 'Dinas Luar'>('Izin');
  const [tanggal, setTanggal] = useState(getCurrentDateStr());
  const [deskripsi, setDeskripsi] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const myIzinList = currentPegawai
    ? ketidakhadiranList.filter((k) => k.id_pegawai === currentPegawai.id)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsi.trim()) {
      alert('Mohon isi deskripsi / alasan ketidakhadiran.');
      return;
    }

    submitKetidakhadiran(
      keterangan,
      tanggal,
      deskripsi,
      fileName || `${keterangan}_${currentPegawai?.nama || 'Surat'}.pdf`
    );

    setIsSuccess(true);
    setDeskripsi('');
    setFileName('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">
          Pengajuan Izin, Sakit & Cuti
        </h2>
        <p className="text-xs text-slate-500">
          Kirim permohonan ketidakhadiran untuk ditinjau oleh Administrator
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengajuan ketidakhadiran berhasil dikirim! Menunggu verifikasi dari Admin.</span>
        </div>
      )}

      {/* Grid: Form (Left) & Riwayat Izin (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Form Pengajuan */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Form Permohonan Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Jenis Izin */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Izin', 'Sakit', 'Cuti', 'Dinas Luar'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setKeterangan(type)}
                    className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all ${
                      keterangan === type
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Alasan / Keterangan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Contoh: Sakit demam dan berobat ke dokter..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Lampiran */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Nama File Lampiran (Opsional)
              </label>
              <input
                type="text"
                placeholder="surat_dokter.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <button
              id="btn-submit-izin"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Pengajuan</span>
            </button>
          </form>
        </div>

        {/* Riwayat Pengajuan Pegawai */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Riwayat Permohonan Saya
          </h3>

          <div className="space-y-3">
            {myIzinList.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">
                Belum ada pengajuan izin atau cuti.
              </p>
            ) : (
              myIzinList.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.keterangan}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status_pengajuan === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status_pengajuan === 'Ditolak'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status_pengajuan}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{formatIndoDate(item.tanggal)}</p>
                  <p className="text-slate-700">{item.deskripsi}</p>
                  {item.file && (
                    <span className="inline-block text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600 font-mono">
                      📎 {item.file}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
