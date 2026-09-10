export const mysqlSchemaSQL = `-- ========================================================
-- Database: \`presensi\`
-- Generated from phpMyAdmin Designer / Sistem Presensi Pegawai
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`presensi\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`presensi\`;

-- --------------------------------------------------------
-- Table structure for table \`jabatan\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`jabatan\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`jabatan\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`lokasi_presensi\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`lokasi_presensi\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_lokasi\` varchar(50) NOT NULL,
  \`alamat_lokasi\` varchar(225) NOT NULL,
  \`tipe_lokasi\` varchar(50) NOT NULL,
  \`latitude\` varchar(50) NOT NULL,
  \`longitude\` varchar(50) NOT NULL,
  \`radius\` int(11) NOT NULL,
  \`zona_waktu\` varchar(4) NOT NULL DEFAULT 'WIB',
  \`jam_masuk\` time NOT NULL,
  \`jam_pulang\` time NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`pegawai\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`pegawai\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nrg\` varchar(50) NOT NULL UNIQUE,
  \`nama\` varchar(50) NOT NULL,
  \`jenis_kelamin\` varchar(10) NOT NULL,
  \`alamat\` varchar(225) NOT NULL,
  \`no_handphone\` varchar(20) NOT NULL,
  \`jabatan\` varchar(50) NOT NULL,
  \`lokasi_presensi\` varchar(50) NOT NULL,
  \`foto\` varchar(225) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_pegawai\` int(11) DEFAULT NULL,
  \`username\` varchar(50) NOT NULL UNIQUE,
  \`password\` varchar(225) NOT NULL,
  \`status\` varchar(20) NOT NULL DEFAULT 'Aktif',
  \`role\` varchar(20) NOT NULL DEFAULT 'Pegawai',
  PRIMARY KEY (\`id\`),
  KEY \`fk_users_pegawai\` (\`id_pegawai\`),
  CONSTRAINT \`fk_users_pegawai\` FOREIGN KEY (\`id_pegawai\`) REFERENCES \`pegawai\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`presensi\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`presensi\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_pegawai\` int(11) NOT NULL,
  \`tanggal_masuk\` date NOT NULL,
  \`jam_masuk\` time NOT NULL,
  \`foto_masuk\` varchar(225) NOT NULL,
  \`tanggal_keluar\` date DEFAULT NULL,
  \`jam_keluar\` time DEFAULT NULL,
  \`foto_keluar\` varchar(225) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_presensi_pegawai\` (\`id_pegawai\`),
  CONSTRAINT \`fk_presensi_pegawai\` FOREIGN KEY (\`id_pegawai\`) REFERENCES \`pegawai\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`ketidakhadiran\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`ketidakhadiran\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_pegawai\` int(11) NOT NULL,
  \`keterangan\` varchar(50) NOT NULL,
  \`tanggal\` date NOT NULL,
  \`deskripsi\` varchar(225) NOT NULL,
  \`file\` varchar(225) DEFAULT NULL,
  \`status_pengajuan\` varchar(20) NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (\`id\`),
  KEY \`fk_ketidakhadiran_pegawai\` (\`id_pegawai\`),
  CONSTRAINT \`fk_ketidakhadiran_pegawai\` FOREIGN KEY (\`id_pegawai\`) REFERENCES \`pegawai\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export const laravelMigration = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Table: jabatan
        Schema::create('jabatan', function (Blueprint $table) {
            $table->id();
            $table->string('jabatan', 50);
            $table->timestamps();
        });

        // 2. Table: lokasi_presensi
        Schema::create('lokasi_presensi', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lokasi', 50);
            $table->string('alamat_lokasi', 225);
            $table->string('tipe_lokasi', 50);
            $table->string('latitude', 50);
            $table->string('longitude', 50);
            $table->integer('radius');
            $table->string('zona_waktu', 4)->default('WIB');
            $table->time('jam_masuk');
            $table->time('jam_pulang');
            $table->timestamps();
        });

        // 3. Table: pegawai
        Schema::create('pegawai', function (Blueprint $table) {
            $table->id();
            $table->string('nrg', 50)->unique();
            $table->string('nama', 50);
            $table->string('jenis_kelamin', 10);
            $table->string('alamat', 225);
            $table->string('no_handphone', 20);
            $table->string('jabatan', 50);
            $table->string('lokasi_presensi', 50);
            $table->string('foto', 225)->nullable();
            $table->timestamps();
        });

        // 4. Table: users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pegawai')->nullable()->constrained('pegawai')->onDelete('cascade');
            $table->string('username', 50)->unique();
            $table->string('password', 225);
            $table->string('status', 20)->default('Aktif');
            $table->string('role', 20)->default('Pegawai');
            $table->rememberToken();
            $table->timestamps();
        });

        // 5. Table: presensi
        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pegawai')->constrained('pegawai')->onDelete('cascade');
            $table->date('tanggal_masuk');
            $table->time('jam_masuk');
            $table->string('foto_masuk', 225);
            $table->date('tanggal_keluar')->nullable();
            $table->time('jam_keluar')->nullable();
            $table->string('foto_keluar', 225)->nullable();
            $table->timestamps();
        });

        // 6. Table: ketidakhadiran
        Schema::create('ketidakhadiran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pegawai')->constrained('pegawai')->onDelete('cascade');
            $table->string('keterangan', 50); // Izin, Sakit, Cuti, Dinas Luar
            $table->date('tanggal');
            $table->string('deskripsi', 225);
            $table->string('file', 225)->nullable();
            $table->string('status_pengajuan', 20)->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ketidakhadiran');
        Schema::dropIfExists('presensi');
        Schema::dropIfExists('users');
        Schema::dropIfExists('pegawai');
        Schema::dropIfExists('lokasi_presensi');
        Schema::dropIfExists('jabatan');
    }
};
`;

export const laravelModels = `// ==========================================
// app/Models/Pegawai.php
// ==========================================
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Pegawai extends Model
{
    use HasFactory;

    protected $table = 'pegawai';
    protected $fillable = [
        'nrg',
        'nama',
        'jenis_kelamin',
        'alamat',
        'no_handphone',
        'jabatan',
        'lokasi_presensi',
        'foto',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'id_pegawai');
    }

    public function presensi()
    {
        return $this->hasMany(Presensi::class, 'id_pegawai');
    }

    public function ketidakhadiran()
    {
        return $this->hasMany(Ketidakhadiran::class, 'id_pegawai');
    }
}

// ==========================================
// app/Models/Presensi.php
// ==========================================
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Presensi extends Model
{
    protected $table = 'presensi';
    protected $fillable = [
        'id_pegawai',
        'tanggal_masuk',
        'jam_masuk',
        'foto_masuk',
        'tanggal_keluar',
        'jam_keluar',
        'foto_keluar',
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }
}

// ==========================================
// app/Models/Ketidakhadiran.php
// ==========================================
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Ketidakhadiran extends Model
{
    protected $table = 'ketidakhadiran';
    protected $fillable = [
        'id_pegawai',
        'keterangan',
        'tanggal',
        'deskripsi',
        'file',
        'status_pengajuan',
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }
}
`;

export const laravelController = `// ==========================================
// app/Http/Controllers/PresensiController.php
// ==========================================
namespace App\\Http\\Controllers;

use App\\Models\\Presensi;
use App\\Models\\LokasiPresensi;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;
use Carbon\\Carbon;

class PresensiController extends Controller
{
    public function storeMasuk(Request $request)
    {
        $request->validate([
            'id_pegawai' => 'required|exists:pegawai,id',
            'latitude' => 'required',
            'longitude' => 'required',
            'foto' => 'required', // base64 string
        ]);

        $today = Carbon::now()->toDateString();
        $currentTime = Carbon::now()->toTimeString();

        // Validasi Duplikasi Absensi Masuk Hari Ini
        $already = Presensi::where('id_pegawai', $request->id_pegawai)
            ->where('tanggal_masuk', $today)
            ->first();

        if ($already) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan presensi masuk hari ini!'
            ], 400);
        }

        // Upload snapshot image
        $image = $request->foto;
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = 'masuk_' . $request->id_pegawai . '_' . time() . '.png';
        Storage::disk('public')->put('presensi/' . $imageName, base64_decode($image));

        $presensi = Presensi::create([
            'id_pegawai' => $request->id_pegawai,
            'tanggal_masuk' => $today,
            'jam_masuk' => $currentTime,
            'foto_masuk' => 'storage/presensi/' . $imageName,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Presensi masuk berhasil dicatat!',
            'data' => $presensi
        ]);
    }
}
`;
