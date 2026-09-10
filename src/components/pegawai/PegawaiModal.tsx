import React, { useState, useEffect } from 'react';
import { Pegawai } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, MapPin } from 'lucide-react';

interface PegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegawaiToEdit?: Pegawai | null;
}

export const PegawaiModal: React.FC<PegawaiModalProps> = ({ isOpen, onClose, pegawaiToEdit }) => {
  const { jabatanList, lokasiList, addPegawai, updatePegawai } = useApp();

  const [nrg, setNrg] = useState('');
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamat, setAlamat] = useState('');
  const [noHandphone, setNoHandphone] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [lokasiPresensi, setLokasiPresensi] = useState('');

  useEffect(() => {
    if (pegawaiToEdit) {
      setNrg(pegawaiToEdit.nrg);
      setNama(pegawaiToEdit.nama);
      setJenisKelamin(pegawaiToEdit.jenis_kelamin);
      setAlamat(pegawaiToEdit.alamat);
      setNoHandphone(pegawaiToEdit.no_handphone);
      setJabatan(pegawaiToEdit.jabatan);
      setLokasiPresensi(pegawaiToEdit.lokasi_presensi);
    } else {
      setNrg(`NRG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setNama('');
      setJenisKelamin('Laki-laki');
      setAlamat('');
      setNoHandphone('');
      setJabatan(jabatanList[0]?.jabatan || 'Guru Mata Pelajaran');
      setLokasiPresensi(lokasiList[0]?.nama_lokasi || 'Kantor Pusat');
    }
  }, [pegawaiToEdit, isOpen, jabatanList, lokasiList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nrg.trim()) {
      alert('Mohon isi nama dan NRG pegawai.');
      return;
    }
    const data = { nrg, nama, jenis_kelamin: jenisKelamin, alamat, no_handphone: noHandphone, jabatan, lokasi_presensi: lokasiPresensi };
    if (pegawaiToEdit) {
      updatePegawai({ ...pegawaiToEdit, ...data });
    } else {
      addPegawai(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {pegawaiToEdit ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
            </h3>
            <p className="text-xs text-slate-500">Tabel: <code className="text-red-700">pegawai</code></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NRG <span className="text-red-500">*</span></label>
              <input type="text" required value={nrg} onChange={(e) => setNrg(e.target.value)}
                placeholder="NRG-2024-001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
              <input type="text" required value={nama} onChange={(e) => setNama(e.target.value)}
                placeholder="Siti Rahmawati, S.Kom."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. Handphone</label>
              <input type="text" value={noHandphone} onChange={(e) => setNoHandphone(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jabatan <span className="text-red-500">*</span></label>
              <select value={jabatan} onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
                {jabatanList.map((j) => (
                  <option key={j.id} value={j.jabatan}>{j.jabatan}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Kerja</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{lokasiList[0]?.nama_lokasi || 'Kantor / Lokasi Kerja Utama'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Tinggal</label>
            <input type="text" value={alamat} onChange={(e) => setAlamat(e.target.value)}
              placeholder="Jl. Pemuda No. 12, Jakarta"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">Batal</button>
            <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors">
              Simpan Data Pegawai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
