import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jabatan } from '../../types';
import { Briefcase, Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

export const JabatanList: React.FC = () => {
  const { jabatanList, pegawaiList, addJabatan, updateJabatan, deleteJabatan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [newJabatan, setNewJabatan] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const filteredJabatan = jabatanList.filter((j) =>
    j.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJabatan.trim()) return;
    addJabatan(newJabatan.trim());
    setNewJabatan('');
  };

  const handleStartEdit = (j: Jabatan) => {
    setEditingId(j.id);
    setEditingText(j.jabatan);
  };

  const handleSaveEdit = (id: number) => {
    if (!editingText.trim()) return;
    updateJabatan({ id, jabatan: editingText.trim() });
    setEditingId(null);
  };

  const handleDelete = (id: number, namaJabatan: string) => {
    const isUsed = pegawaiList.some((p) => p.jabatan === namaJabatan);
    if (isUsed) {
      alert(`Jabatan "${namaJabatan}" tidak dapat dihapus karena masih digunakan oleh pegawai.`);
      return;
    }
    if (confirm(`Hapus master jabatan "${namaJabatan}"?`)) {
      deleteJabatan(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-slate-700" />
            Master Data Jabatan (Tabel: <code className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono">jabatan</code>)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar posisi struktur organisasi & jabatan fungsional
          </p>
        </div>
      </div>

      {/* Grid: Form Tambah & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Tambah */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Tambah Jabatan Baru
          </h3>
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Jabatan / Posisi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newJabatan}
                onChange={(e) => setNewJabatan(e.target.value)}
                placeholder="Contoh: Guru Matematika"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              id="btn-submit-jabatan"
              type="submit"
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Jabatan</span>
            </button>
          </form>
        </div>

        {/* Table List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Total: {filteredJabatan.length} Jabatan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
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
                  const isEditing = editingId === j.id;

                  return (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{j.id}</td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded-lg text-xs"
                            />
                            <button
                              onClick={() => handleSaveEdit(j.id)}
                              className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
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
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {count} orang
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(j)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(j.id, j.jabatan)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
};
