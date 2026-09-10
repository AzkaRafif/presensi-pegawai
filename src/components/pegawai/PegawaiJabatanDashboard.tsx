import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pegawai, Jabatan } from '../../types';
import { PegawaiModal } from './PegawaiModal';
import {
  Users,
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  UserCheck,
  Filter,
  Layers,
  MapPin
} from 'lucide-react';

export const PegawaiJabatanDashboard: React.FC = () => {
  const {
    pegawaiList,
    jabatanList,
    deletePegawai,
    addJabatan,
    updateJabatan,
    deleteJabatan,
    lokasiList,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pegawai' | 'jabatan'>('pegawai');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJabatanFilter, setSelectedJabatanFilter] = useState<string>('Semua');

  // Modal State for Pegawai
  const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);
  const [pegawaiToEdit, setPegawaiToEdit] = useState<Pegawai | null>(null);

  // State for Jabatan Management
  const [newJabatanName, setNewJabatanName] = useState('');
  const [editingJabatanId, setEditingJabatanId] = useState<number | null>(null);
  const [editingJabatanText, setEditingJabatanText] = useState('');
  const [isAddingJabatan, setIsAddingJabatan] = useState(false);

  // Stats calculation
  const totalPegawai = pegawaiList.length;
  const totalJabatan = jabatanList.length;
  const totalLaki = pegawaiList.filter((p) => p.jenis_kelamin === 'Laki-laki').length;
  const totalPerempuan = pegawaiList.filter((p) => p.jenis_kelamin === 'Perempuan').length;

  // Filtered Pegawai
  const filteredPegawai = pegawaiList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.no_handphone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJabatan =
      selectedJabatanFilter === 'Semua' ? true : p.jabatan === selectedJabatanFilter;

    return matchesSearch && matchesJabatan;
  });

  // Filtered Jabatan
  const filteredJabatan = jabatanList.filter((j) =>
    j.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers for Pegawai
  const handleOpenAddPegawai = () => {
    setPegawaiToEdit(null);
    setIsPegawaiModalOpen(true);
  };

  const handleOpenEditPegawai = (p: Pegawai) => {
    setPegawaiToEdit(p);
    setIsPegawaiModalOpen(true);
  };

  const handleDeletePegawai = (id: number, nama: string) => {
    if (confirm(`Hapus data pegawai "${nama}"? Data user dan presensi terkait akan dihapus.`)) {
      deletePegawai(id);
    }
  };

  // Handlers for Jabatan
  const handleAddJabatanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJabatanName.trim()) return;
    addJabatan(newJabatanName.trim());
    setNewJabatanName('');
    setIsAddingJabatan(false);
  };

  const handleStartEditJabatan = (j: Jabatan) => {
    setEditingJabatanId(j.id);
    setEditingJabatanText(j.jabatan);
  };

  const handleSaveEditJabatan = (id: number) => {
    if (!editingJabatanText.trim()) return;
    updateJabatan({ id, jabatan: editingJabatanText.trim() });
    setEditingJabatanId(null);
  };

  const handleDeleteJabatan = (id: number, namaJabatan: string) => {
    const isUsed = pegawaiList.some((p) => p.jabatan === namaJabatan);
    if (isUsed) {
      alert(`Jabatan "${namaJabatan}" tidak dapat dihapus karena masih digunakan oleh pegawai.`);
      return;
    }
    if (confirm(`Hapus master jabatan "${namaJabatan}"?`)) {
      deleteJabatan(id);
    }
  };

  const singleLocationName = lokasiList[0]?.nama_lokasi || 'Kantor / Lokasi Kerja Utama';

  return (
    <div className="space-y-6">
      {/* Header Dasbor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Dasbor Data Pegawai & Jabatan
            </h2>
            <span className="text-[11px] font-semibold bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full">
              1 Lokasi Kerja
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen terpadu struktur jabatan dan data seluruh pegawai di {singleLocationName}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-add-pegawai"
            onClick={handleOpenAddPegawai}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
          <button
            id="btn-add-jabatan-quick"
            onClick={() => {
              setActiveSubTab('jabatan');
              setIsAddingJabatan(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
            <span>Tambah Jabatan</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Ringkas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pegawai */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Pegawai
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPegawai}</p>
            <span className="text-[10px] text-slate-500">1 Lokasi Kerja</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Jabatan */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Jabatan
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalJabatan}</p>
            <span className="text-[10px] text-slate-500">Posisi Organisasi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Pegawai Laki-laki */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Laki-laki
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalLaki}</p>
            <span className="text-[10px] text-slate-500">
              {totalPegawai > 0 ? Math.round((totalLaki / totalPegawai) * 100) : 0}% dari total
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pegawai Perempuan */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Perempuan
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPerempuan}</p>
            <span className="text-[10px] text-slate-500">
              {totalPegawai > 0 ? Math.round((totalPerempuan / totalPegawai) * 100) : 0}% dari total
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* View Selector Tabs & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Control */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('pegawai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'pegawai'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Pegawai ({pegawaiList.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('jabatan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'jabatan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Master Jabatan ({jabatanList.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeSubTab === 'pegawai'
                  ? 'Cari nama, NRG, jabatan, no HP...'
                  : 'Cari nama jabatan...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Interactive Filter Pills for Jabatan (Available when in Pegawai view) */}
        {activeSubTab === 'pegawai' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Jabatan:
            </span>
            <button
              onClick={() => setSelectedJabatanFilter('Semua')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedJabatanFilter === 'Semua'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({pegawaiList.length})
            </button>
            {jabatanList.map((j) => {
              const count = pegawaiList.filter((p) => p.jabatan === j.jabatan).length;
              const isSelected = selectedJabatanFilter === j.jabatan;
              return (
                <button
                  key={j.id}
                  onClick={() => setSelectedJabatanFilter(j.jabatan)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{j.jabatan}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW 1: DATA PEGAWAI */}
      {activeSubTab === 'pegawai' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Pegawai</th>
                  <th className="py-3.5 px-4">NRG</th>
                  <th className="py-3.5 px-4">Jabatan</th>
                  <th className="py-3.5 px-4">Kontak & Alamat</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPegawai.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Tidak ada data pegawai yang sesuai dengan pencarian atau filter.
                    </td>
                  </tr>
                ) : (
                  filteredPegawai.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar inisial — foto profil dihapus */}
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                            {p.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{p.nama}</p>
                            <p className="text-[10px] text-slate-500">{p.jenis_kelamin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {p.nrg}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold text-[11px] border border-slate-200">
                          {p.jabatan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-slate-700">{p.no_handphone}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{p.alamat}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditPegawai(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Pegawai"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePegawai(p.id, p.nama)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Hapus Pegawai"
                          >
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
      )}

      {/* VIEW 2: MASTER JABATAN */}
      {activeSubTab === 'jabatan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Tambah Jabatan Baru */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-red-600" />
              <span>Tambah Jabatan Baru</span>
            </h3>
            <form onSubmit={handleAddJabatanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Posisi / Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newJabatanName}
                  onChange={(e) => setNewJabatanName(e.target.value)}
                  placeholder="Contoh: Staff Perpustakaan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Jabatan</span>
              </button>
            </form>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Setiap jabatan yang ditambahkan otomatis tersedia pada formulir pendaftaran dan edit pegawai.
            </p>
          </div>

          {/* Daftar Master Jabatan */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Posisi Struktur Organisasi
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Total: {filteredJabatan.length} Jabatan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-16">ID</th>
                    <th className="py-3 px-4">Nama Jabatan</th>
                    <th className="py-3 px-4">Jumlah Pegawai</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJabatan.map((j) => {
                    const count = pegawaiList.filter((p) => p.jabatan === j.jabatan).length;
                    const isEditing = editingJabatanId === j.id;

                    return (
                      <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500">{j.id}</td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingJabatanText}
                                onChange={(e) => setEditingJabatanText(e.target.value)}
                                className="px-2 py-1 border border-slate-300 rounded-lg text-xs"
                              />
                              <button
                                onClick={() => handleSaveEditJabatan(j.id)}
                                className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingJabatanId(null)}
                                className="p-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-800">{j.jabatan}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedJabatanFilter(j.jabatan);
                              setActiveSubTab('pegawai');
                            }}
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Klik untuk melihat pegawai dengan jabatan ini"
                          >
                            {count} pegawai
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEditJabatan(j)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJabatan(j.id, j.jabatan)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pegawai Modal Add/Edit */}
      {isPegawaiModalOpen && (
        <PegawaiModal
          isOpen={isPegawaiModalOpen}
          onClose={() => setIsPegawaiModalOpen(false)}
          pegawaiToEdit={pegawaiToEdit}
        />
      )}
    </div>
  );
};
