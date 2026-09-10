import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndoDate, isLateCheckIn } from '../../utils/geoUtils';
import { Download, Printer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterMode = 'semua' | 'mingguan' | 'bulanan' | 'kustom';

// Helper: dapatkan Senin dari tanggal tertentu
const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Min, 1=Sen, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const toDateStr = (d: Date): string => d.toISOString().split('T')[0];

const namaHariBulan = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

const namaRentangMinggu = (senin: Date): string => {
  const jumat = new Date(senin);
  jumat.setDate(senin.getDate() + 6);
  return `${senin.getDate()} – ${jumat.getDate()} ${senin.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
};

export const RekapPresensi: React.FC = () => {
  const { presensiList, pegawaiList, jabatanList, lokasiList } = useApp();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ─── Filter state ───
  const [filterMode, setFilterMode] = useState<FilterMode>('bulanan');
  const [filterJabatan, setFilterJabatan] = useState('Semua');
  const [filterLokasi, setFilterLokasi] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Untuk mode mingguan — offset minggu (0 = minggu ini, -1 = minggu lalu, dst)
  const [weekOffset, setWeekOffset] = useState(0);
  // Untuk mode bulanan — offset bulan
  const [monthOffset, setMonthOffset] = useState(0);
  // Untuk mode kustom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ─── Hitung rentang tanggal aktif ───
  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    if (filterMode === 'mingguan') {
      const senin = getMondayOfWeek(today);
      senin.setDate(senin.getDate() + weekOffset * 7);
      const minggu = new Date(senin);
      minggu.setDate(senin.getDate() + 6);
      return {
        rangeStart: toDateStr(senin),
        rangeEnd: toDateStr(minggu),
        rangeLabel: namaRentangMinggu(senin),
      };
    }
    if (filterMode === 'bulanan') {
      const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return {
        rangeStart: toDateStr(d),
        rangeEnd: toDateStr(lastDay),
        rangeLabel: namaHariBulan(toDateStr(d)),
      };
    }
    if (filterMode === 'kustom') {
      return {
        rangeStart: startDate,
        rangeEnd: endDate,
        rangeLabel: startDate && endDate ? `${formatIndoDate(startDate)} – ${formatIndoDate(endDate)}` : 'Pilih rentang',
      };
    }
    // semua
    return { rangeStart: '', rangeEnd: '', rangeLabel: 'Semua Data' };
  }, [filterMode, weekOffset, monthOffset, startDate, endDate]);

  // ─── Filter data ───
  const filteredLogs = useMemo(() => {
    return presensiList.filter((item) => {
      const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
      if (!pegawai) return false;
      const matchesSearch =
        pegawai.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pegawai.nrg.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJabatan = filterJabatan === 'Semua' || pegawai.jabatan === filterJabatan;
      const matchesLokasi = filterLokasi === 'Semua' || pegawai.lokasi_presensi === filterLokasi;
      const matchesStart = rangeStart ? item.tanggal_masuk >= rangeStart : true;
      const matchesEnd = rangeEnd ? item.tanggal_masuk <= rangeEnd : true;
      return matchesSearch && matchesJabatan && matchesLokasi && matchesStart && matchesEnd;
    });
  }, [presensiList, pegawaiList, searchTerm, filterJabatan, filterLokasi, rangeStart, rangeEnd]);

  // ─── Statistik ringkas ───
  const totalHadir = filteredLogs.length;
  const terlambat = filteredLogs.filter((item) => {
    const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
    const lokasi = lokasiList.find((l) => l.nama_lokasi === pegawai?.lokasi_presensi);
    return isLateCheckIn(item.jam_masuk, lokasi?.jam_masuk || '07:30:00');
  }).length;

  // ─── Export CSV ───
  const exportCSV = () => {
    const headers = ['ID', 'NRG', 'Nama Pegawai', 'Jabatan', 'Lokasi', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'];
    const rows = filteredLogs.map((item) => {
      const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
      const lokasi = lokasiList.find((l) => l.nama_lokasi === pegawai?.lokasi_presensi);
      const isLate = isLateCheckIn(item.jam_masuk, lokasi?.jam_masuk || '07:30:00');
      return [
        item.id, pegawai?.nrg || '',
        `"${pegawai?.nama || ''}"`, `"${pegawai?.jabatan || ''}"`,
        `"${pegawai?.lokasi_presensi || ''}"`,
        item.tanggal_masuk, item.jam_masuk,
        item.jam_keluar || '-',
        isLate ? 'Terlambat' : 'Tepat Waktu',
      ];
    });
    const csv = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `Rekap_Presensi_${rangeLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterModeOptions: { value: FilterMode; label: string }[] = [
    { value: 'mingguan', label: 'Mingguan' },
    { value: 'bulanan', label: 'Bulanan' },
    { value: 'semua', label: 'Semua' },
    { value: 'kustom', label: 'Kustom' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Presensi</h2>
          <p className="text-xs text-slate-500">Laporan lengkap presensi seluruh pegawai</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors">
            <Download className="w-3.5 h-3.5" /> Ekspor CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
            <Printer className="w-3.5 h-3.5" /> Cetak
          </button>
        </div>
      </div>

      {/* ─── Filter Panel ─── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">

        {/* Baris 1: Mode filter (pill) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />Periode:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
            {filterModeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterMode(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === opt.value
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Baris 2: Navigator minggu/bulan atau date picker kustom */}
        {(filterMode === 'mingguan' || filterMode === 'bulanan') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => filterMode === 'mingguan' ? setWeekOffset(w => w - 1) : setMonthOffset(m => m - 1)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
              {rangeLabel}
            </div>
            <button
              onClick={() => filterMode === 'mingguan' ? setWeekOffset(w => w + 1) : setMonthOffset(m => m + 1)}
              disabled={(filterMode === 'mingguan' && weekOffset >= 0) || (filterMode === 'bulanan' && monthOffset >= 0)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => filterMode === 'mingguan' ? setWeekOffset(0) : setMonthOffset(0)}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
            >
              {filterMode === 'mingguan' ? 'Minggu Ini' : 'Bulan Ini'}
            </button>
          </div>
        )}

        {filterMode === 'kustom' && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dari Tanggal</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <span className="text-slate-400 mt-4">—</span>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        )}

        {/* Baris 3: Filter tambahan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Cari Pegawai</label>
            <input type="text" placeholder="Nama / NRG..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter Jabatan</label>
            <select value={filterJabatan} onChange={(e) => setFilterJabatan(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
              <option value="Semua">Semua Jabatan</option>
              {jabatanList.map((j) => <option key={j.id} value={j.jabatan}>{j.jabatan}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter Lokasi</label>
            <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
              <option value="Semua">Semua Lokasi</option>
              {lokasiList.map((l) => <option key={l.id} value={l.nama_lokasi}>{l.nama_lokasi}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Statistik ringkas ─── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{totalHadir}</p>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Total Kehadiran</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalHadir - terlambat}</p>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">Tepat Waktu</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{terlambat}</p>
          <p className="text-xs text-amber-700 font-semibold mt-0.5">Terlambat</p>
        </div>
      </div>

      {/* ─── Tabel ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600">
            Menampilkan <span className="font-bold text-slate-900">{filteredLogs.length}</span> data
            {rangeLabel !== 'Semua Data' && (
              <span className="ml-1 text-slate-500">— {rangeLabel}</span>
            )}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Masuk</th>
                <th className="py-3 px-4">Pulang</th>
                <th className="py-3 px-4">Foto</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data presensi untuk periode ini.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => {
                  const pegawai = pegawaiList.find((p) => p.id === item.id_pegawai);
                  const lokasi = lokasiList.find((l) => l.nama_lokasi === pegawai?.lokasi_presensi);
                  const isLate = isLateCheckIn(item.jam_masuk, lokasi?.jam_masuk || '07:30:00');
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {(pegawai?.nama || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{pegawai?.nama}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{pegawai?.nrg}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{pegawai?.jabatan || '-'}</td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">{pegawai?.lokasi_presensi || '-'}</td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatIndoDate(item.tanggal_masuk)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.jam_masuk}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.jam_keluar || '-'}</td>
                      <td className="py-3 px-4">
                        {item.foto_masuk ? (
                          <img src={item.foto_masuk} alt="Selfie" className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                            style={{ imageRendering: 'pixelated' }} />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
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
