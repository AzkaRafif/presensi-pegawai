import { Pegawai, User, Jabatan, LokasiPresensi, Presensi, Ketidakhadiran } from '../types';

export const initialJabatan: Jabatan[] = [
  { id: 1, jabatan: 'Kepala Sekolah' },
  { id: 2, jabatan: 'Wakil Kepala Sekolah' },
  { id: 3, jabatan: 'Guru Mata Pelajaran' },
  { id: 4, jabatan: 'Guru Bimbingan Konseling' },
  { id: 5, jabatan: 'Kepala Tata Usaha' },
  { id: 6, jabatan: 'Staff IT & Multimedia' },
  { id: 7, jabatan: 'Staff Keuangan & Bendahara' },
  { id: 8, jabatan: 'Staff Perpustakaan' },
];

// 3 Lokasi / Cabang berbeda
export const initialLokasi: LokasiPresensi[] = [
  {
    id: 1,
    nama_lokasi: 'Kantor Pusat',
    alamat_lokasi: 'Lokasi Kantor Pusat, Jakarta Selatan',
    tipe_lokasi: 'Pusat',
    latitude: '-6.370991',
    longitude: '106.745264',
    radius: 150,
    zona_waktu: 'WIB',
    jam_masuk: '07:30:00',
    jam_pulang: '16:00:00',
  },
  {
    id: 2,
    nama_lokasi: 'Kantor Cabang Monas',
    alamat_lokasi: 'Monas, Gambir, Jakarta Pusat',
    tipe_lokasi: 'Cabang',
    latitude: '-6.176354',
    longitude: '106.827153',
    radius: 200,
    zona_waktu: 'WIB',
    jam_masuk: '08:00:00',
    jam_pulang: '17:00:00',
  },
  {
    id: 3,
    nama_lokasi: 'Kantor Cabang Yogyakarta',
    alamat_lokasi: 'Malioboro, Gedongtengen, Yogyakarta',
    tipe_lokasi: 'Cabang',
    latitude: '-7.797068',
    longitude: '110.370529',
    radius: 200,
    zona_waktu: 'WIB',
    jam_masuk: '07:30:00',
    jam_pulang: '16:00:00',
  },
];

// Pembagian lokasi per pegawai:
// Kantor Pusat   : Azka Rafif (id=2), Dr. Ahmad Fauzi (id=1)
// Cabang Monas   : Bambang Sugeng (id=3), Dewi Lestari (id=4)
// Cabang Yogya   : Hendra Setiawan (id=5), Nurul Hidayah (id=6)
export const initialPegawai: Pegawai[] = [
  {
    id: 1,
    nrg: 'NRG-2024-001',
    nama: 'Dr. Ahmad Fauzi, M.Pd.',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Flamboyan No. 12, Tebet, Jakarta Selatan',
    no_handphone: '081298765432',
    jabatan: 'Kepala Sekolah',
    lokasi_presensi: 'Kantor Pusat',
  },
  {
    id: 2,
    nrg: 'NRG-2024-002',
    nama: 'Azka Rafif',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Anggrek Melati No. 4, Kebon Jeruk, Jakarta Barat',
    no_handphone: '081377889900',
    jabatan: 'Staff IT & Multimedia',
    lokasi_presensi: 'Kantor Pusat', // tetap di sini
  },
  {
    id: 3,
    nrg: 'NRG-2024-003',
    nama: 'Bambang Sugeng, S.T., M.Eng.',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Cempaka Putih Tengah No. 29, Jakarta Pusat',
    no_handphone: '085712349876',
    jabatan: 'Guru Mata Pelajaran',
    lokasi_presensi: 'Kantor Cabang Monas',
  },
  {
    id: 4,
    nrg: 'NRG-2024-004',
    nama: 'Dewi Lestari, S.Pd.',
    jenis_kelamin: 'Perempuan',
    alamat: 'Jl. Raya Condet No. 15, Pasar Rebo, Jakarta Timur',
    no_handphone: '087855443322',
    jabatan: 'Guru Bimbingan Konseling',
    lokasi_presensi: 'Kantor Cabang Monas',
  },
  {
    id: 5,
    nrg: 'NRG-2024-005',
    nama: 'Hendra Setiawan, S.E.',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Margonda Raya No. 102, Depok',
    no_handphone: '081900112233',
    jabatan: 'Staff Keuangan & Bendahara',
    lokasi_presensi: 'Kantor Cabang Yogyakarta',
  },
  {
    id: 6,
    nrg: 'NRG-2024-006',
    nama: 'Nurul Hidayah, S.IP.',
    jenis_kelamin: 'Perempuan',
    alamat: 'Jl. Percetakan Negara No. 55, Jakarta Pusat',
    no_handphone: '082166778899',
    jabatan: 'Kepala Tata Usaha',
    lokasi_presensi: 'Kantor Cabang Yogyakarta',
  },
];

export const initialUsers: User[] = [
  // Satu-satunya Admin
  {
    id: 1,
    id_pegawai: null,
    username: 'admin',
    password: 'password123',
    status: 'Aktif',
    role: 'Admin',
  },
  // Pegawai biasa — bisa presensi & izin
  {
    id: 2,
    id_pegawai: 2,
    username: 'azka_rafif',
    password: 'password123',
    status: 'Aktif',
    role: 'Pegawai',
  },
  {
    id: 3,
    id_pegawai: 3,
    username: 'bambang_sugeng',
    password: 'password123',
    status: 'Aktif',
    role: 'Pegawai',
  },
  {
    id: 4,
    id_pegawai: 4,
    username: 'dewi_lestari',
    password: 'password123',
    status: 'Aktif',
    role: 'Pegawai',
  },
  {
    id: 5,
    id_pegawai: 5,
    username: 'hendra_setiawan',
    password: 'password123',
    status: 'Aktif',
    role: 'Pegawai',
  },
  // Operator — hanya bisa lihat riwayat presensi semua pegawai
  {
    id: 6,
    id_pegawai: 1,
    username: 'ahmad_fauzi',
    password: 'password123',
    status: 'Aktif',
    role: 'Operator',
  },
  {
    id: 7,
    id_pegawai: 6,
    username: 'nurul_tu',
    password: 'password123',
    status: 'Aktif',
    role: 'Operator',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Helper: buat tanggal relatif dari hari ini
const daysAgo = (n: number) => new Date(Date.now() - 86400000 * n).toISOString().split('T')[0];

// Helper: apakah hari itu adalah hari kerja (Senin-Jumat)
const isWeekday = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const day = d.getDay();
  return day !== 0 && day !== 6;
};

// Generate semua hari kerja dalam 60 hari terakhir
const workdays: string[] = [];
for (let i = 60; i >= 1; i--) {
  const d = daysAgo(i);
  if (isWeekday(d)) workdays.push(d);
}

// Jam masuk per lokasi (sedikit variasi agar realistis)
const jamMasukOptions: Record<string, string[]> = {
  'Kantor Pusat':           ['07:15', '07:22', '07:28', '07:35', '07:42', '07:50', '07:55'],
  'Kantor Cabang Monas':    ['07:55', '08:03', '08:10', '08:18', '08:25', '08:35', '08:45'],
  'Kantor Cabang Yogyakarta': ['07:20', '07:28', '07:35', '07:41', '07:48', '07:55', '08:05'],
};

const jamPulangOptions = ['16:00', '16:05', '16:12', '16:20', '16:30', '16:45', '17:00'];

const pick = <T,>(arr: T[], seed: number): T => arr[seed % arr.length];

// Foto selfie kualitas rendah per pegawai
const fotoByPegawai: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=15',
  2: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=15',
  3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=15',
  4: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=15',
  5: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=15',
  6: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=15',
};

// Data pegawai dengan lokasi presensinya
const pegawaiLokasi: Record<number, string> = {
  1: 'Kantor Pusat',
  2: 'Kantor Pusat',
  3: 'Kantor Cabang Monas',
  4: 'Kantor Cabang Monas',
  5: 'Kantor Cabang Yogyakarta',
  6: 'Kantor Cabang Yogyakarta',
};

// Generate presensi: tiap pegawai hadir ~85% dari hari kerja
let presensiId = 1;
const generated: Presensi[] = [];

[1, 2, 3, 4, 5, 6].forEach((pegawaiId) => {
  const lokasi = pegawaiLokasi[pegawaiId];
  const foto = fotoByPegawai[pegawaiId];
  const jamMasukList = jamMasukOptions[lokasi] ?? jamMasukOptions['Kantor Pusat'];

  workdays.forEach((tanggal, idx) => {
    // ~85% hadir (skip jika idx+pegawaiId habis dibagi 7 — simulasi absen acak)
    const seed = idx + pegawaiId * 13;
    if (seed % 7 === 0) return; // skip (tidak hadir)

    const jamMasuk = pick(jamMasukList, seed) + ':' + String((seed * 17) % 60).padStart(2, '0');
    const jamPulang = pick(jamPulangOptions, seed + 3) + ':' + String((seed * 11) % 60).padStart(2, '0');

    generated.push({
      id: presensiId++,
      id_pegawai: pegawaiId,
      tanggal_masuk: tanggal,
      jam_masuk: jamMasuk,
      foto_masuk: foto,
      tanggal_keluar: tanggal,
      jam_keluar: jamPulang,
      foto_keluar: foto,
    });
  });
});

// Hari ini: beberapa pegawai sudah masuk tapi belum pulang
const todayWorkers = [1, 2, 3, 5]; // yang sudah masuk hari ini
todayWorkers.forEach((pegawaiId) => {
  const lokasi = pegawaiLokasi[pegawaiId];
  const foto = fotoByPegawai[pegawaiId];
  const jamMasukList = jamMasukOptions[lokasi] ?? jamMasukOptions['Kantor Pusat'];
  const seed = pegawaiId * 7;
  const jamMasuk = pick(jamMasukList, seed) + ':' + String((seed * 17) % 60).padStart(2, '0');

  generated.push({
    id: presensiId++,
    id_pegawai: pegawaiId,
    tanggal_masuk: today,
    jam_masuk: jamMasuk,
    foto_masuk: foto,
    tanggal_keluar: null,
    jam_keluar: null,
    foto_keluar: null,
  });
});

export const initialPresensi: Presensi[] = generated;

export const initialKetidakhadiran: Ketidakhadiran[] = [
  {
    id: 1,
    id_pegawai: 4,
    keterangan: 'Sakit',
    tanggal: today,
    deskripsi: 'Mengalami demam tinggi dan flu berat, dianjurkan istirahat dokter selama 2 hari.',
    file: 'Surat_Keterangan_Dokter_RS_Medika.pdf',
    status_pengajuan: 'Pending',
  },
  {
    id: 2,
    id_pegawai: 6,
    keterangan: 'Dinas Luar',
    tanggal: today,
    deskripsi: 'Menghadiri Rapat Koordinasi Kurikulum & Tata Kelola Kepegawaian di Balai Diklat Kemendikbud.',
    file: 'Surat_Tugas_Dinas_Luar_082.pdf',
    status_pengajuan: 'Disetujui',
  },
  {
    id: 3,
    id_pegawai: 5,
    keterangan: 'Izin',
    tanggal: yesterday,
    deskripsi: 'Menghadiri wisuda adik kandung di Universitas Indonesia.',
    file: 'Undangan_Wisuda_UI.pdf',
    status_pengajuan: 'Disetujui',
  },
  {
    id: 4,
    id_pegawai: 3,
    keterangan: 'Cuti',
    tanggal: '2026-09-10',
    deskripsi: 'Pengajuan cuti tahunan acara keluarga di Yogyakarta.',
    file: 'Form_Permohonan_Cuti.pdf',
    status_pengajuan: 'Pending',
  },
];
