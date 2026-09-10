import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentTimeStr } from '../../utils/geoUtils';
import { calculateDistanceMeters, formatDistance } from '../../utils/geoUtils';
import {
  Camera, CheckCircle2, AlertTriangle, RotateCw,
  LogIn, LogOut, ImageOff, MapPin, Navigation, Loader2
} from 'lucide-react';

export const PresensiCamera: React.FC = () => {
  const {
    currentPegawai,
    presensiList,
    lokasiList,
    doPresensiMasuk,
    doPresensiKeluar,
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const assignedLokasi = lokasiList.find(
    (l) => l.nama_lokasi === currentPegawai?.lokasi_presensi
  ) || lokasiList[0];

  // ─── Camera state ───
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mode, setMode] = useState<'camera' | 'preview' | 'done'>('camera');
  // Flag: user sudah klik "Ambil Foto untuk Absen Pulang" — paksa tampilkan kamera meski ada foto masuk
  const [preparingPulang, setPreparingPulang] = useState(false);

  // ─── GPS state ───
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'ok' | 'out' | 'error'>('checking');
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Reaktif: baca langsung dari presensiList
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPresensi = currentPegawai
    ? presensiList.find(p => p.id_pegawai === currentPegawai.id && p.tanggal_masuk === todayStr)
    : undefined;
  const hasAbsenMasuk = !!todayPresensi?.jam_masuk;
  const hasAbsenPulang = !!todayPresensi?.jam_keluar;

  // Foto yang ditampilkan di area preview
  const displayPhoto = (() => {
    if (mode === 'preview' && capturedPhoto) return capturedPhoto;
    // Jika sedang mempersiapkan foto pulang, jangan tampilkan foto masuk
    if (preparingPulang) return null;
    if (hasAbsenPulang) return todayPresensi?.foto_keluar ?? null;
    if (hasAbsenMasuk) return todayPresensi?.foto_masuk ?? null;
    return null;
  })();

  const showVideo = (mode === 'camera' && !displayPhoto) || (preparingPulang && mode === 'camera');

  // ─── GPS Geofencing ───
  useEffect(() => {
    if (!assignedLokasi?.latitude || !assignedLokasi?.longitude) {
      setGpsStatus('error');
      return;
    }

    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('checking');

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsCoords({ lat: latitude, lng: longitude });

        const dist = calculateDistanceMeters(
          latitude,
          longitude,
          parseFloat(assignedLokasi.latitude),
          parseFloat(assignedLokasi.longitude)
        );
        setCurrentDistance(dist);
        setGpsStatus(dist <= assignedLokasi.radius ? 'ok' : 'out');
      },
      () => {
        setGpsStatus('error');
        setCurrentDistance(null);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [assignedLokasi]);

  // ─── Camera ───
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } else {
        setCameraError('Webcam tidak tersedia di browser ini.');
      }
    } catch {
      setCameraError('Kamera tidak dapat diakses. Gunakan tombol ambil foto untuk foto simulasi.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    if (!hasAbsenPulang) startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current && streamActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.45));
        setMode('preview');
        return;
      }
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=20',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=20',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=20',
    ];
    setCapturedPhoto(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    setMode('preview');
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setMode('camera');
    startCamera();
  };

  const handleAbsenDone = () => {
    stopCamera();
    setMode('done');
    setCapturedPhoto(null);
    setPreparingPulang(false);
  };

  const handleAbsen = (type: 'masuk' | 'keluar') => {
    setFeedback(null);
    const photo = capturedPhoto ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=20';
    setIsProcessing(true);
    setTimeout(() => {
      const res = type === 'masuk' ? doPresensiMasuk(photo) : doPresensiKeluar(photo);
      setIsProcessing(false);
      setFeedback({ type: res.success ? 'success' : 'error', message: res.message });
      if (res.success) handleAbsenDone();
    }, 600);
  };

  const nextAction: 'masuk' | 'keluar' | null = !hasAbsenMasuk ? 'masuk' : !hasAbsenPulang ? 'keluar' : null;
  const savedPhotoLabel = hasAbsenPulang
    ? `Foto Pulang — ${todayPresensi?.jam_keluar}`
    : hasAbsenMasuk ? `Foto Masuk — ${todayPresensi?.jam_masuk}` : null;

  // GPS boleh absen: status ok ATAU error (browser tidak support / izin ditolak — fallback diizinkan)
  const gpsAllowAbsen = gpsStatus === 'ok' || gpsStatus === 'error';

  const gpsColor = {
    checking: 'bg-slate-100 text-slate-600 border-slate-200',
    ok: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    out: 'bg-rose-50 text-rose-800 border-rose-200',
    error: 'bg-amber-50 text-amber-800 border-amber-200',
  }[gpsStatus];

  const gpsLabel = {
    checking: 'Mendeteksi lokasi...',
    ok: `Dalam radius — ${currentDistance !== null ? formatDistance(currentDistance) : ''} dari kantor`,
    out: `Di luar radius — ${currentDistance !== null ? formatDistance(currentDistance) : ''} dari kantor (maks. ${assignedLokasi?.radius}m)`,
    error: 'GPS tidak tersedia — izin lokasi ditolak atau tidak didukung',
  }[gpsStatus];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Presensi Masuk & Pulang</h2>
        <p className="text-xs text-slate-500 mt-0.5">Ambil foto selfie lalu tekan tombol absen untuk mencatat kehadiran</p>
      </div>

      {/* GPS Status Bar */}
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-semibold ${gpsColor}`}>
        {gpsStatus === 'checking' ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
        ) : gpsStatus === 'ok' ? (
          <Navigation className="w-4 h-4 shrink-0" />
        ) : (
          <MapPin className="w-4 h-4 shrink-0" />
        )}
        <span>{gpsLabel}</span>
        {gpsStatus === 'out' && (
          <span className="ml-auto text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
            Presensi diblokir
          </span>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Kamera / Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted
              className={`w-full h-full object-cover ${showVideo ? 'block' : 'hidden'}`} />

            {displayPhoto && (
              <img src={displayPhoto} alt="Foto Presensi" className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }} />
            )}

            {!showVideo && !displayPhoto && (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <ImageOff className="w-10 h-10 opacity-40" />
                <span className="text-xs">Kamera tidak aktif</span>
              </div>
            )}

            {showVideo && streamActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-44 h-56 border-2 border-dashed border-white/60 rounded-3xl" />
              </div>
            )}

            {savedPhotoLabel && mode === 'done' && (
              <div className="absolute top-2 left-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Tersimpan: {savedPhotoLabel}</span>
              </div>
            )}

            {mode === 'preview' && capturedPhoto && (
              <div className="absolute top-2 left-2 right-2 bg-amber-500/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                Preview — belum tersimpan, tekan Absen untuk menyimpan
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg text-[10px] flex items-center justify-between">
              <span className="truncate">{assignedLokasi?.nama_lokasi || 'Kantor Utama'}</span>
              <span className="font-mono shrink-0 ml-2">{getCurrentTimeStr()} WIB</span>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {cameraError && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              ⚠ {cameraError}
            </p>
          )}

          <div className="flex items-center gap-2">
            {mode === 'camera' && (showVideo || preparingPulang) && (
              <button onClick={takeSnapshot} disabled={hasAbsenPulang}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
                <Camera className="w-4 h-4" />
                {preparingPulang ? 'Ambil Foto Selfie (Pulang)' : 'Ambil Foto Selfie'}
              </button>
            )}
            {mode === 'preview' && capturedPhoto && (
              <button onClick={retakePhoto}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors">
                <RotateCw className="w-4 h-4" /> Ambil Ulang
              </button>
            )}
            {mode === 'done' && !hasAbsenPulang && (
              <button onClick={() => { setPreparingPulang(true); setCapturedPhoto(null); setMode('camera'); startCamera(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
                <Camera className="w-4 h-4" /> Ambil Foto untuk Absen Pulang
              </button>
            )}
            {/* Juga tampilkan tombol ini jika sudah masuk tapi belum pulang dan mode camera tapi belum preparingPulang */}
            {mode === 'camera' && hasAbsenMasuk && !hasAbsenPulang && !preparingPulang && !showVideo && (
              <button onClick={() => { setPreparingPulang(true); startCamera(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
                <Camera className="w-4 h-4" /> Ambil Foto untuk Absen Pulang
              </button>
            )}
            {mode === 'done' && hasAbsenPulang && (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Presensi hari ini selesai
              </div>
            )}
          </div>
        </div>

        {/* Panel Aksi */}
        <div className="space-y-4">
          {/* Info Lokasi & Jam */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi & Ketentuan Kerja</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Lokasi Penugasan:</span>
                <span className="font-bold text-slate-800">{assignedLokasi?.nama_lokasi}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Koordinat Kantor:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {assignedLokasi?.latitude}, {assignedLokasi?.longitude}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Radius Geofencing:</span>
                <span className="font-bold text-blue-700">{assignedLokasi?.radius}m</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jam Masuk Standar:</span>
                <span className="font-mono font-bold text-slate-800">{assignedLokasi?.jam_masuk || '07:30'} WIB</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Jam Pulang Standar:</span>
                <span className="font-mono font-bold text-slate-800">{assignedLokasi?.jam_pulang || '16:00'} WIB</span>
              </div>
            </div>
          </div>

          {/* Tombol Absen */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi Presensi Hari Ini</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Absen Masuk */}
              <button
                disabled={hasAbsenMasuk || isProcessing || mode !== 'preview' || !gpsAllowAbsen || gpsStatus === 'out'}
                onClick={() => handleAbsen('masuk')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  hasAbsenMasuk
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                    : mode === 'preview' && nextAction === 'masuk' && gpsAllowAbsen && gpsStatus !== 'out'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <LogIn className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">{hasAbsenMasuk ? 'Sudah Masuk ✓' : 'Absen Masuk'}</span>
                <span className="text-[10px] opacity-80 font-mono mt-0.5">
                  {hasAbsenMasuk ? todayPresensi?.jam_masuk
                    : gpsStatus === 'out' ? 'Diluar radius!'
                    : mode === 'preview' ? 'Foto siap, klik!'
                    : 'Ambil foto dulu'}
                </span>
              </button>

              {/* Absen Pulang */}
              <button
                disabled={!hasAbsenMasuk || hasAbsenPulang || isProcessing || mode !== 'preview' || !gpsAllowAbsen || gpsStatus === 'out'}
                onClick={() => handleAbsen('keluar')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  hasAbsenPulang
                    ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-default'
                    : hasAbsenMasuk && mode === 'preview' && gpsAllowAbsen && gpsStatus !== 'out'
                    ? 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-xs hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <LogOut className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">{hasAbsenPulang ? 'Sudah Pulang ✓' : 'Absen Pulang'}</span>
                <span className="text-[10px] opacity-80 font-mono mt-0.5">
                  {hasAbsenPulang ? todayPresensi?.jam_keluar
                    : gpsStatus === 'out' ? 'Di luar radius!'
                    : !hasAbsenMasuk ? 'Masuk dulu'
                    : mode === 'preview' ? 'Foto siap, klik!'
                    : 'Ambil foto dulu'}
                </span>
              </button>
            </div>

            {gpsStatus === 'out' && (
              <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-center font-semibold">
                🚫 Anda berada di luar radius {assignedLokasi?.radius}m dari kantor. Presensi tidak dapat dilakukan.
              </p>
            )}
            {!hasAbsenMasuk && mode === 'camera' && gpsStatus !== 'out' && (
              <p className="text-[11px] text-slate-500 text-center pt-1">
                📸 Klik <strong>Ambil Foto Selfie</strong> terlebih dahulu, lalu tekan <strong>Absen Masuk</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
