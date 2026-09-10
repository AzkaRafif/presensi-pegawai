import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pegawai, User, Jabatan, LokasiPresensi, Presensi, Ketidakhadiran, ActiveTab } from '../types';
import {
  initialPegawai,
  initialUsers,
  initialJabatan,
  initialLokasi,
  initialPresensi,
  initialKetidakhadiran,
} from '../data/initialData';
import { getCurrentDateStr, getCurrentTimeStr } from '../utils/geoUtils';

interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  currentPegawai: Pegawai | undefined;
  role: 'Admin' | 'Pegawai' | 'Operator';

  // Data Collections
  pegawaiList: Pegawai[];
  usersList: User[];
  jabatanList: Jabatan[];
  lokasiList: LokasiPresensi[];
  presensiList: Presensi[];
  ketidakhadiranList: Ketidakhadiran[];

  // CRUD Pegawai
  addPegawai: (p: Omit<Pegawai, 'id'>) => void;
  updatePegawai: (p: Pegawai) => void;
  deletePegawai: (id: number) => void;

  // CRUD Jabatan
  addJabatan: (j: string) => void;
  updateJabatan: (j: Jabatan) => void;
  deleteJabatan: (id: number) => void;

  // CRUD Lokasi
  addLokasi: (l: Omit<LokasiPresensi, 'id'>) => void;
  updateLokasi: (l: LokasiPresensi) => void;
  deleteLokasi: (id: number) => void;

  // CRUD Users
  addUser: (u: Omit<User, 'id'>) => void;
  updateUser: (u: User) => void;
  deleteUser: (id: number) => void;

  // Presensi Actions
  doPresensiMasuk: (fotoBase64: string) => { success: boolean; message: string };
  doPresensiKeluar: (fotoBase64: string) => { success: boolean; message: string };
  getTodayPresensiForPegawai: (id_pegawai: number) => Presensi | undefined;

  // Ketidakhadiran Actions
  submitKetidakhadiran: (
    keterangan: 'Izin' | 'Sakit' | 'Cuti' | 'Dinas Luar',
    tanggal: string,
    deskripsi: string,
    file: string
  ) => void;
  updateStatusKetidakhadiran: (id: number, status: 'Disetujui' | 'Ditolak') => void;

  pendingIzinCount: number;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Bump versi ini setiap kali initialData berubah agar localStorage lama otomatis ter-reset
const DATA_VERSION = 'v10';
const versionKey = 'simpresensi_data_version';
if (localStorage.getItem(versionKey) !== DATA_VERSION) {
  // Hapus semua key simpresensi lama kecuali versi itu sendiri
  Object.keys(localStorage)
    .filter((k) => k.startsWith('simpresensi_'))
    .forEach((k) => localStorage.removeItem(k));
  localStorage.setItem(versionKey, DATA_VERSION);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('simpresensi_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('simpresensi_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => {
    const saved = localStorage.getItem('simpresensi_pegawai');
    return saved ? JSON.parse(saved) : initialPegawai;
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('simpresensi_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [jabatanList, setJabatanList] = useState<Jabatan[]>(() => {
    const saved = localStorage.getItem('simpresensi_jabatan');
    return saved ? JSON.parse(saved) : initialJabatan;
  });

  const [lokasiList, setLokasiList] = useState<LokasiPresensi[]>(() => {
    const saved = localStorage.getItem('simpresensi_lokasi');
    return saved ? JSON.parse(saved) : initialLokasi;
  });

  const [presensiList, setPresensiList] = useState<Presensi[]>(() => {
    const saved = localStorage.getItem('simpresensi_presensi');
    return saved ? JSON.parse(saved) : initialPresensi;
  });

  const [ketidakhadiranList, setKetidakhadiranList] = useState<Ketidakhadiran[]>(() => {
    const saved = localStorage.getItem('simpresensi_ketidakhadiran');
    return saved ? JSON.parse(saved) : initialKetidakhadiran;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('simpresensi_pegawai', JSON.stringify(pegawaiList)); }, [pegawaiList]);
  useEffect(() => { localStorage.setItem('simpresensi_users', JSON.stringify(usersList)); }, [usersList]);
  useEffect(() => { localStorage.setItem('simpresensi_jabatan', JSON.stringify(jabatanList)); }, [jabatanList]);
  useEffect(() => { localStorage.setItem('simpresensi_lokasi', JSON.stringify(lokasiList)); }, [lokasiList]);
  useEffect(() => { localStorage.setItem('simpresensi_presensi', JSON.stringify(presensiList)); }, [presensiList]);
  useEffect(() => { localStorage.setItem('simpresensi_ketidakhadiran', JSON.stringify(ketidakhadiranList)); }, [ketidakhadiranList]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('simpresensi_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('simpresensi_current_user');
    }
  }, [currentUser]);

  const currentPegawai = pegawaiList.find((p) => p.id === currentUser?.id_pegawai);
  const role: 'Admin' | 'Pegawai' | 'Operator' = currentUser?.role || 'Pegawai';

  // Login
  const login = (username: string, password: string): { success: boolean; message: string } => {
    const found = usersList.find(
      (u) => u.username === username && u.password === password && u.status === 'Aktif'
    );
    if (!found) {
      return { success: false, message: 'Username atau password salah, atau akun tidak aktif.' };
    }
    setCurrentUser(found);
    setIsLoggedIn(true);
    localStorage.setItem('simpresensi_logged_in', 'true');
    setActiveTab('dashboard');
    return { success: true, message: 'Login berhasil!' };
  };

  // Logout
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    localStorage.removeItem('simpresensi_logged_in');
    localStorage.removeItem('simpresensi_current_user');
  };

  // CRUD Pegawai
  const addPegawai = (p: Omit<Pegawai, 'id'>) => {
    const newId = Math.max(0, ...pegawaiList.map((x) => x.id)) + 1;
    const newPegawai: Pegawai = { ...p, id: newId };
    setPegawaiList((prev) => [...prev, newPegawai]);
    const newUser: User = {
      id: Math.max(0, ...usersList.map((x) => x.id)) + 1,
      id_pegawai: newId,
      username: p.nama.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15) || `user_${newId}`,
      password: 'password123',
      status: 'Aktif',
      role: 'Pegawai',
    };
    setUsersList((prev) => [...prev, newUser]);
  };

  const updatePegawai = (p: Pegawai) => {
    setPegawaiList((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const deletePegawai = (id: number) => {
    setPegawaiList((prev) => prev.filter((item) => item.id !== id));
    setUsersList((prev) => prev.filter((item) => item.id_pegawai !== id));
    setPresensiList((prev) => prev.filter((item) => item.id_pegawai !== id));
    setKetidakhadiranList((prev) => prev.filter((item) => item.id_pegawai !== id));
  };

  // CRUD Jabatan
  const addJabatan = (jabatanText: string) => {
    const newId = Math.max(0, ...jabatanList.map((x) => x.id)) + 1;
    setJabatanList((prev) => [...prev, { id: newId, jabatan: jabatanText }]);
  };
  const updateJabatan = (j: Jabatan) => {
    setJabatanList((prev) => prev.map((item) => (item.id === j.id ? j : item)));
  };
  const deleteJabatan = (id: number) => {
    setJabatanList((prev) => prev.filter((item) => item.id !== id));
  };

  // CRUD Lokasi
  const addLokasi = (l: Omit<LokasiPresensi, 'id'>) => {
    const newId = Math.max(0, ...lokasiList.map((x) => x.id)) + 1;
    setLokasiList((prev) => [...prev, { ...l, id: newId }]);
  };
  const updateLokasi = (l: LokasiPresensi) => {
    setLokasiList((prev) => prev.map((item) => (item.id === l.id ? l : item)));
  };
  const deleteLokasi = (id: number) => {
    setLokasiList((prev) => prev.filter((item) => item.id !== id));
  };

  // CRUD Users
  const addUser = (u: Omit<User, 'id'>) => {
    const newId = Math.max(0, ...usersList.map((x) => x.id)) + 1;
    setUsersList((prev) => [...prev, { ...u, id: newId }]);
  };
  const updateUser = (u: User) => {
    setUsersList((prev) => prev.map((item) => (item.id === u.id ? u : item)));
  };
  const deleteUser = (id: number) => {
    setUsersList((prev) => prev.filter((item) => item.id !== id));
  };

  // Presensi
  const getTodayPresensiForPegawai = (id_pegawai: number) => {
    const today = getCurrentDateStr();
    return presensiList.find((p) => p.id_pegawai === id_pegawai && p.tanggal_masuk === today);
  };

  const doPresensiMasuk = (fotoBase64: string) => {
    if (!currentUser?.id_pegawai) {
      return { success: false, message: 'User tidak terhubung dengan data pegawai!' };
    }
    const today = getCurrentDateStr();
    const existing = getTodayPresensiForPegawai(currentUser.id_pegawai);
    if (existing) {
      return { success: false, message: 'Anda sudah melakukan presensi masuk hari ini!' };
    }
    const newPresensi: Presensi = {
      id: Math.max(0, ...presensiList.map((x) => x.id)) + 1,
      id_pegawai: currentUser.id_pegawai,
      tanggal_masuk: today,
      jam_masuk: getCurrentTimeStr(),
      foto_masuk: fotoBase64,
      tanggal_keluar: null,
      jam_keluar: null,
      foto_keluar: null,
    };
    setPresensiList((prev) => [newPresensi, ...prev]);
    return { success: true, message: 'Berhasil melakukan Presensi Masuk!' };
  };

  const doPresensiKeluar = (fotoBase64: string) => {
    if (!currentUser?.id_pegawai) {
      return { success: false, message: 'User tidak terhubung dengan data pegawai!' };
    }
    const today = getCurrentDateStr();
    const existingIndex = presensiList.findIndex(
      (p) => p.id_pegawai === currentUser.id_pegawai && p.tanggal_masuk === today
    );
    if (existingIndex === -1) {
      return { success: false, message: 'Anda belum melakukan presensi masuk hari ini!' };
    }
    if (presensiList[existingIndex].jam_keluar) {
      return { success: false, message: 'Anda sudah melakukan presensi pulang hari ini!' };
    }
    const updated = [...presensiList];
    updated[existingIndex] = {
      ...updated[existingIndex],
      tanggal_keluar: today,
      jam_keluar: getCurrentTimeStr(),
      foto_keluar: fotoBase64,
    };
    setPresensiList(updated);
    return { success: true, message: 'Berhasil melakukan Presensi Pulang!' };
  };

  const submitKetidakhadiran = (
    keterangan: 'Izin' | 'Sakit' | 'Cuti' | 'Dinas Luar',
    tanggal: string,
    deskripsi: string,
    file: string
  ) => {
    if (!currentUser?.id_pegawai) return;
    const newRecord: Ketidakhadiran = {
      id: Math.max(0, ...ketidakhadiranList.map((x) => x.id)) + 1,
      id_pegawai: currentUser.id_pegawai,
      keterangan,
      tanggal,
      deskripsi,
      file: file || 'Surat_Permohonan.pdf',
      status_pengajuan: 'Pending',
    };
    setKetidakhadiranList((prev) => [newRecord, ...prev]);
  };

  const updateStatusKetidakhadiran = (id: number, status: 'Disetujui' | 'Ditolak') => {
    setKetidakhadiranList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status_pengajuan: status } : k))
    );
  };

  const pendingIzinCount = ketidakhadiranList.filter((k) => k.status_pengajuan === 'Pending').length;

  const resetToDemoData = () => {
    setPegawaiList(initialPegawai);
    setUsersList(initialUsers);
    setJabatanList(initialJabatan);
    setLokasiList(initialLokasi);
    setPresensiList(initialPresensi);
    setKetidakhadiranList(initialKetidakhadiran);
    logout();
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        activeTab,
        setActiveTab,
        currentUser,
        currentPegawai,
        role,
        pegawaiList,
        usersList,
        jabatanList,
        lokasiList,
        presensiList,
        ketidakhadiranList,
        addPegawai,
        updatePegawai,
        deletePegawai,
        addJabatan,
        updateJabatan,
        deleteJabatan,
        addLokasi,
        updateLokasi,
        deleteLokasi,
        addUser,
        updateUser,
        deleteUser,
        doPresensiMasuk,
        doPresensiKeluar,
        getTodayPresensiForPegawai,
        submitKetidakhadiran,
        updateStatusKetidakhadiran,
        pendingIzinCount,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
