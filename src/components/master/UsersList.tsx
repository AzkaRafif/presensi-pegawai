import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Shield, Plus, Search, Edit2, Trash2, Key, CheckCircle, XCircle, X } from 'lucide-react';

export const UsersList: React.FC = () => {
  const { usersList, pegawaiList, addUser, updateUser, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Form State
  const [idPegawai, setIdPegawai] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [role, setRole] = useState<'Admin' | 'Pegawai'>('Pegawai');

  const filteredUsers = usersList.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setIdPegawai(pegawaiList[0]?.id || null);
    setUsername('');
    setPassword('password123');
    setStatus('Aktif');
    setRole('Pegawai');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setUserToEdit(u);
    setIdPegawai(u.id_pegawai);
    setUsername(u.username);
    setPassword(u.password || 'password123');
    setStatus(u.status);
    setRole(u.role);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (userToEdit) {
      updateUser({
        ...userToEdit,
        id_pegawai: idPegawai ? Number(idPegawai) : null,
        username,
        password,
        status,
        role,
      });
    } else {
      addUser({
        id_pegawai: idPegawai ? Number(idPegawai) : null,
        username,
        password,
        status,
        role,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, uname: string) => {
    if (confirm(`Hapus akun user "${uname}"?`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-slate-700" />
            Data Users & Hak Akses (Tabel: <code className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono">users</code>)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola akun autentikasi login pegawai & hak akses administrator
          </p>
        </div>

        <button
          id="btn-add-user"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-red-200 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun User</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari username / role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          Total: {filteredUsers.length} User
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Pegawai Terkait (FK)</th>
                <th className="py-3 px-4">Role / Hak Akses</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const pegawai = pegawaiList.find((p) => p.id === u.id_pegawai);

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{u.id}</td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 font-mono">{u.username}</span>
                    </td>

                    <td className="py-3 px-4">
                      {pegawai ? (
                        <div>
                          <p className="font-semibold text-slate-800">{pegawai.nama}</p>
                          <p className="text-[11px] text-slate-500 font-mono">NRG: {pegawai.nrg}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Tidak terikat pegawai (Superuser)</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          u.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.status === 'Aktif' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Hapus User"
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

      {/* Modal User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {userToEdit ? 'Edit Akun User' : 'Tambah User Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hubungkan ke Data Pegawai
                </label>
                <select
                  value={idPegawai || ''}
                  onChange={(e) => setIdPegawai(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Pilih Pegawai --</option>
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.nrg})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username_pegawai"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password (Bcrypt Hash di Laravel)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role / Akses
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'Admin' | 'Pegawai')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Admin">Admin / HRD</option>
                    <option value="Pegawai">Pegawai / Guru</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs shadow-red-200"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
