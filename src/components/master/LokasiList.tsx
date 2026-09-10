import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LokasiPresensi } from '../../types';
import { LokasiModal } from './LokasiModal';
import { MapPin, Edit2, Clock, Users, Navigation, Plus } from 'lucide-react';

export const LokasiList: React.FC = () => {
  const { lokasiList, pegawaiList } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lokasiToEdit, setLokasiToEdit] = useState<LokasiPresensi | null>(null);

  const handleOpenEdit = (lokasi: LokasiPresensi) => {
    setLokasiToEdit(lokasi);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setLokasiToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pengaturan Lokasi & Jam Kerja</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lokasiList.length} lokasi/cabang terdaftar — konfigurasi GPS geofencing dan jam kerja per lokasi
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Lokasi
        </button>
      </div>

      {/* Daftar semua lokasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {lokasiList.map((lokasi) => {
          const pegawaiDiSini = pegawaiList.filter(p => p.lokasi_presensi === lokasi.nama_lokasi);
          return (
            <div key={lokasi.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              {/* Header kartu */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{lokasi.nama_lokasi}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {lokasi.tipe_lokasi}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(lokasi)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                  title="Edit Lokasi"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Alamat */}
              <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 leading-relaxed">
                {lokasi.alamat_lokasi}
              </p>

              {/* GPS */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Koordinat GPS
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-slate-400 text-[9px] font-semibold">LAT</p>
                    <p className="font-mono font-bold text-slate-800">{lokasi.latitude}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[9px] font-semibold">LNG</p>
                    <p className="font-mono font-bold text-slate-800">{lokasi.longitude}</p>
                  </div>
                </div>
                <p className="text-[10px] text-blue-600 font-semibold">
                  Radius: {lokasi.radius}m
                </p>
              </div>

              {/* Jam Kerja */}
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-bold">{lokasi.jam_masuk}</span>
                <span className="text-slate-400">→</span>
                <span className="font-mono font-bold">{lokasi.jam_pulang}</span>
                <span className="text-slate-400 text-[10px]">{lokasi.zona_waktu}</span>
              </div>

              {/* Pegawai di lokasi ini */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Users className="w-3.5 h-3.5" /> Pegawai ({pegawaiDiSini.length})
                </div>
                {pegawaiDiSini.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Belum ada pegawai di lokasi ini</p>
                ) : (
                  <div className="space-y-1.5">
                    {pegawaiDiSini.map(p => (
                      <div key={p.id} className="flex items-center gap-2 text-[11px]">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[9px] shrink-0">
                          {p.nama.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700 truncate">{p.nama}</span>
                        <span className="text-slate-400 shrink-0">· {p.jabatan}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <LokasiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lokasiToEdit={lokasiToEdit} />
      )}
    </div>
  );
};
