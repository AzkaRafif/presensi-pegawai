import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pegawai } from '../../types';
import { PegawaiModal } from './PegawaiModal';
import { Users, Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react';

export const PegawaiList: React.FC = () => {
  const { pegawaiList, deletePegawai } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pegawaiToEdit, setPegawaiToEdit] = useState<Pegawai | null>(null);

  const filteredPegawai = pegawaiList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lokasi_presensi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => { setPegawaiToEdit(null); setIsModalOpen(true); };
  const handleOpenEdit = (p: Pegawai) => { setPegawaiToEdit(p); setIsModalOpen(true); };
  const handleDelete = (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai "${nama}"?`)) {
      deletePegawai(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Data Pegawai</h2>
          <p className="text-xs text-slate-500">Daftar seluruh pegawai, jabatan, dan penugasan lokasi</p>
        </div>
        <button
          id="btn-add-pegawai"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Pegawai</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NRG, jabatan, lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Total: {filteredPegawai.length} Pegawai</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">NRG</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Lokasi Kantor</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPegawai.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Tidak ada data pegawai yang cocok.</td>
                </tr>
              ) : (
                filteredPegawai.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar inisial — tidak pakai foto profil */}
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                          {p.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.nama}</p>
                          <p className="text-[10px] text-slate-500">{p.jenis_kelamin}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{p.nrg}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md font-semibold text-slate-700 text-[11px]">{p.jabatan}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />{p.lokasi_presensi}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-slate-700">{p.no_handphone}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{p.alamat}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Pegawai">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.nama)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors" title="Hapus Pegawai">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PegawaiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pegawaiToEdit={pegawaiToEdit} />
      )}
    </div>
  );
};
