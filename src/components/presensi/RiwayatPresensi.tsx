import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndoDate, isLateCheckIn } from '../../utils/geoUtils';
import { Calendar, Search, Filter, Camera } from 'lucide-react';

export const RiwayatPresensi: React.FC = () => {
  const { currentPegawai, currentUser, presensiList, lokasiList } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const assignedLokasi = lokasiList.find(
    (l) => l.nama_lokasi === currentPegawai?.lokasi_presensi
  ) || lokasiList[0];

  const myPresensiLogs = currentPegawai
    ? presensiList.filter((p) => p.id_pegawai === currentPegawai.id)
    : [];

  const filteredLogs = myPresensiLogs.filter((item) => {
    const matchesSearch = item.tanggal_masuk.includes(searchTerm);
    const matchesMonth = filterMonth ? item.tanggal_masuk.startsWith(filterMonth) : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">
          Riwayat Presensi Saya
        </h2>
        <p className="text-xs text-slate-500">
          Log lengkap kehadiran masuk dan pulang
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tanggal (YYYY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />
          {filterMonth && (
            <button
              onClick={() => setFilterMonth('')}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Foto Masuk</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Foto Pulang</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada catatan presensi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => {
                  const isLate = isLateCheckIn(
                    item.jam_masuk,
                    assignedLokasi?.jam_masuk || '07:30:00'
                  );

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {formatIndoDate(item.tanggal_masuk)}
                      </td>
                      <td className="py-3 px-4">
                        {item.foto_masuk ? (
                          <img
                            src={item.foto_masuk}
                            alt="Masuk"
                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {item.jam_masuk}
                      </td>
                      <td className="py-3 px-4">
                        {item.foto_keluar ? (
                          <img
                            src={item.foto_keluar}
                            alt="Pulang"
                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {item.jam_keluar || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isLate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isLate ? 'Terlambat' : 'Tepat Waktu'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
