export interface Pegawai {
  id: number;
  nrg: string; // Nomor Registrasi Guru / Pegawai
  nama: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_handphone: string;
  jabatan: string;
  lokasi_presensi: string;
  // foto profil dihapus
}

export interface User {
  id: number;
  id_pegawai: number | null;
  username: string;
  password?: string;
  status: 'Aktif' | 'Nonaktif';
  role: 'Admin' | 'Pegawai' | 'Operator';
}

export interface Jabatan {
  id: number;
  jabatan: string;
}

export interface LokasiPresensi {
  id: number;
  nama_lokasi: string;
  alamat_lokasi: string;
  tipe_lokasi: string;
  latitude: string;
  longitude: string;
  radius: number; // in meters
  zona_waktu: 'WIB' | 'WITA' | 'WIT';
  jam_masuk: string; // HH:mm:ss
  jam_pulang: string; // HH:mm:ss
}

export interface Presensi {
  id: number;
  id_pegawai: number;
  tanggal_masuk: string; // YYYY-MM-DD
  jam_masuk: string; // HH:mm:ss
  foto_masuk: string; // foto selfie presensi masuk
  tanggal_keluar: string | null;
  jam_keluar: string | null;
  foto_keluar: string | null; // foto selfie presensi pulang
}

export interface Ketidakhadiran {
  id: number;
  id_pegawai: number;
  keterangan: 'Izin' | 'Sakit' | 'Cuti' | 'Dinas Luar';
  tanggal: string; // YYYY-MM-DD
  deskripsi: string;
  file: string;
  status_pengajuan: 'Pending' | 'Disetujui' | 'Ditolak';
}

export type ActiveTab =
  | 'dashboard'
  | 'presensi-kamera'
  | 'riwayat-presensi'
  | 'pengajuan-izin'
  | 'pegawai-jabatan'
  | 'data-pegawai'
  | 'data-jabatan'
  | 'data-lokasi'
  | 'data-users'
  | 'rekap-presensi'
  | 'verifikasi-izin'
  | 'laravel-db-tools';
