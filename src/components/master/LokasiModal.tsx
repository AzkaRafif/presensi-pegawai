import React, { useState, useEffect } from 'react';
import { LokasiPresensi } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, MapPin } from 'lucide-react';

interface LokasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lokasiToEdit?: LokasiPresensi | null;
}

export const LokasiModal: React.FC<LokasiModalProps> = ({ isOpen, onClose, lokasiToEdit }) => {
  const { addLokasi, updateLokasi } = useApp();

  const [namaLokasi, setNamaLokasi] = useState('');
  const [alamatLokasi, setAlamatLokasi] = useState('');
  const [tipeLokasi, setTipeLokasi] = useState('Pusat');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(150);
  const [zonaWaktu, setZonaWaktu] = useState<'WIB' | 'WITA' | 'WIT'>('WIB');
  const [jamMasuk, setJamMasuk] = useState('07:30:00');
  const [jamPulang, setJamPulang] = useState('16:00:00');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  useEffect(() => {
    if (lokasiToEdit) {
      setNamaLokasi(lokasiToEdit.nama_lokasi);
      setAlamatLokasi(lokasiToEdit.alamat_lokasi);
      setTipeLokasi(lokasiToEdit.tipe_lokasi);
      setLatitude(lokasiToEdit.latitude);
      setLongitude(lokasiToEdit.longitude);
      setRadius(lokasiToEdit.radius);
      setZonaWaktu(lokasiToEdit.zona_waktu);
      setJamMasuk(lokasiToEdit.jam_masuk);
      setJamPulang(lokasiToEdit.jam_pulang);
    } else {
      setNamaLokasi('');
      setAlamatLokasi('');
      setTipeLokasi('Cabang');
      setLatitude('');
      setLongitude('');
      setRadius(150);
      setZonaWaktu('WIB');
      setJamMasuk('07:30:00');
      setJamPulang('16:00:00');
    }
  }, [lokasiToEdit, isOpen]);

  if (!isOpen) return null;

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung browser ini.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsDetectingGps(false);
      },
      () => {
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
        setIsDetectingGps(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLokasi.trim()) { alert('Nama lokasi wajib diisi.'); return; }
    if (!latitude || !longitude) { alert('Latitude dan Longitude wajib diisi.'); return; }
    const data: Omit<LokasiPresensi, 'id'> = {
      nama_lokasi: namaLokasi,
      alamat_lokasi: alamatLokasi,
      tipe_lokasi: tipeLokasi,
      latitude,
      longitude,
      radius,
      zona_waktu: zonaWaktu,
      jam_masuk: jamMasuk,
      jam_pulang: jamPulang,
    };
    if (lokasiToEdit) {
      updateLokasi({ ...lokasiToEdit, ...data });
    } else {
      addLokasi(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lokasiToEdit ? 'Edit Lokasi & Jam Kerja' : 'Tambah Lokasi Baru'}
            </h3>
            <p className="text-xs text-slate-500">Tabel: <code className="text-red-700 font-mono">lokasi_presensi</code></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Nama & Tipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lokasi / Kantor <span className="text-red-500">*</span></label>
              <input type="text" required value={namaLokasi} onChange={(e) => setNamaLokasi(e.target.value)}
                placeholder="Kantor Pusat / Kampus A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tipe Lokasi</label>
              <input type="text" value={tipeLokasi} onChange={(e) => setTipeLokasi(e.target.value)}
                placeholder="Pusat / Cabang"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea rows={2} value={alamatLokasi} onChange={(e) => setAlamatLokasi(e.target.value)}
              placeholder="Jl. Pemuda No. 45, Jakarta Selatan"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* GPS Koordinat */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Koordinat GPS Geofencing
              </span>
              <button
                type="button"
                onClick={detectCurrentLocation}
                disabled={isDetectingGps}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold text-[11px] transition-colors"
              >
                {isDetectingGps ? (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                {isDetectingGps ? 'Mendeteksi...' : 'Deteksi Lokasi Saat Ini'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Latitude <span className="text-red-500">*</span></label>
                <input type="text" required value={latitude} onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.229728"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Longitude <span className="text-red-500">*</span></label>
                <input type="text" required value={longitude} onChange={(e) => setLongitude(e.target.value)}
                  placeholder="106.807449"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Radius Geofencing: <span className="text-blue-700 font-bold">{radius} meter</span>
              </label>
              <input type="range" min={50} max={2000} step={10} value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>50m</span><span>500m</span><span>1000m</span><span>2000m</span>
              </div>
            </div>
            <p className="text-[10px] text-blue-600">
              Pegawai hanya bisa absen jika berada dalam radius {radius}m dari koordinat ini.
            </p>
          </div>

          {/* Zona Waktu & Jam Kerja */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Zona Waktu</label>
              <select value={zonaWaktu} onChange={(e) => setZonaWaktu(e.target.value as 'WIB' | 'WITA' | 'WIT')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="WIB">WIB (UTC+7)</option>
                <option value="WITA">WITA (UTC+8)</option>
                <option value="WIT">WIT (UTC+9)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Masuk (Batas)</label>
              <input type="time" step="1" required value={jamMasuk} onChange={(e) => setJamMasuk(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pulang</label>
              <input type="time" step="1" required value={jamPulang} onChange={(e) => setJamPulang(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">Batal</button>
            <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors">
              Simpan Lokasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
