# Firebase Configuration Guide (Updated with Cloudinary)

## ⚠️ PENTING: Perubahan Storage

Firebase Storage **tidak lagi menawarkan "test mode"**. Sebagai alternatif, kita menggunakan **Cloudinary** untuk penyimpanan file (gambar/video) dengan:

- ✅ **25GB storage GRATIS** (vs Firebase 5GB)
- ✅ **25GB/month bandwidth** (vs Firebase 1GB/day)
- ✅ Auto-optimization
- ✅ Global CDN
- ✅ **Tidak perlu kartu kredit**

**Lihat panduan lengkap: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)**

---

## Langkah 1: Membuat Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** atau **"Create a project"**
3. Masukkan nama proyek (misal: `my-invitation-app`)
4. Nonaktifkan Google Analytics (opsional)
5. Klik **"Create project"**

---

## Langkah 2: Mengaktifkan Authentication

1. Di Firebase Console, pilih proyek Anda
2. Di sidebar kiri, klik **Build** → **Authentication**
3. Klik **"Get started"**
4. Pilih tab **"Sign-in method"**
5. Klik **"Email/Password"**
6. Toggle **"Enable"** dan klik **"Save"**

### Membuat Admin User

1. Di tab **"Users"**, klik **"Add user"**
2. Masukkan email dan password untuk admin
3. Klik **"Add user"**

> **Catatan:** Simpan email dan password admin dengan aman!

---

## Langkah 3: Membuat Firestore Database

1. Di sidebar kiri, klik **Build** → **Firestore Database**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"** (test mode sudah tidak ada)
4. Pilih lokasi database (pilih yang terdekat, misal: `asia-southeast1` untuk Singapore)
5. Klik **"Enable"**

### Setup Security Rules

Setelah database dibuat:
1. Buka tab **Rules**
2. Copy-paste rules dari [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md)
3. Klik **"Publish"**

---

## Langkah 4: Setup Cloudinary (GANTI Firebase Storage)

### 4.1 Daftar Cloudinary

1. Buka [Cloudinary.com](https://cloudinary.com/)
2. Klik **"Sign Up Free"**
3. Daftar dengan email atau login dengan GitHub/Google
4. Pilih **FREE plan** (25GB gratis)
5. Verifikasi email

### 4.2 Dapatkan Credentials

1. Di Cloudinary Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

2. Buat **Upload Preset** (untuk upload tanpa backend):
   - Settings (⚙️) → Upload → Upload presets
   - Klik **"Add upload preset"**
   - Isi:
     - **Preset name**: `invitation-uploads`
     - **Signing Mode**: **Unsigned** (PENTING!)
     - **Folder**: `invitation-app`
     - **Overwrite**: `false`
   - Klik **"Save"**

### 4.3 Update Environment Variables

Edit file `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Cloudinary Configuration (WAJIB DIISI)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invitation-uploads
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Lihat panduan lengkap: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)**

---

## Langkah 5: Mendapatkan Firebase Configuration

1. Di Firebase Console, klik ikon **gear** (⚙️) di samping "Project Overview"
2. Pilih **"Project settings"**
3. Scroll ke bawah ke bagian **"Your apps"**
4. Klik ikon **Web** (</>)
5. Masukkan nama app (misal: `my-invitation-app`)
6. Klik **"Register app"**
7. Salin nilai dari `firebaseConfig` object
8. Paste ke `.env.local`

---

## Langkah 6: Setup Security Rules

### Firestore Rules Only (No Storage)

Karena kita menggunakan Cloudinary, Firebase Storage **TIDAK PERLU** dibuat.

**Firestore Rules:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Config - hanya admin yang bisa tulis
    match /config/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Flashback - hanya admin yang bisa tulis
    match /flashback/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gallery - hanya admin yang bisa tulis
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Guests - semua bisa baca dan tulis (untuk ucapan)
    match /guests/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

**Cara apply:**
1. Firebase Console → Firestore Database → Rules
2. Paste rules di atas
3. Klik **"Publish"**

---

## Langkah 7: Inisialisasi Data Awal

Setelah aplikasi berjalan:
1. Login sebagai admin di `/admin`
2. Isi data melalui Admin Dashboard:
   - Konfigurasi undangan (salam, nama acara, ayat, dll)
   - Foto pengantin (upload ke Cloudinary)
   - Lokasi dan waktu acara
   - Flashback
   - Galeri foto (upload ke Cloudinary)

---

## Struktur Database (Firestore)

### Collection `config`
Dokumen tunggal: `undanganSettings`

```js
{
  backgroundCover: "url",
  salamArab: "string",
  namaAcara: "string",
  ayatQuran: "string",
  musicUrl: "string",
  pengantinPria: { foto: "cloudinary_url", nama: "string", namaOrtu: "string" },
  pengantinWanita: { foto: "cloudinary_url", nama: "string", namaOrtu: "string" },
  lokasi: { nama: "string", waktu: "string", linkMap: "string" },
  bunga: { bentuk: "string", warna: "string", kecepatan: "number", intensitas: "number" }
}
```

### Collection `flashback`

```js
{
  judul: "string",
  deskripsi: "string",
  gambar: "cloudinary_url", // opsional
  urutan: "number"
}
```

### Collection `gallery`

```js
{
  imageUrl: "cloudinary_url",
  urutan: "number",
  createdAt: "timestamp"
}
```

### Collection `guests`

```js
{
  nama: "string",
  hadir: "boolean",
  alamat: "string",
  ucapan: "string",
  createdAt: "timestamp"
}
```

---

## Cloudinary Structure

```
Cloudinary Media Library:
├── images/
│   ├── cover/
│   ├── pengantin/
│   ├── flashback/
│   └── gallery/
└── videos/
    └── flashback/
```

---

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Solusi:**
1. Firebase Console → Authentication → Settings
2. Di bagian **"Authorized domains"**, pastikan `localhost` ada di daftar

### Error: "Missing or insufficient permissions"

**Solusi:**
1. Periksa Firestore Rules sudah dipublish
2. Pastikan admin user sudah login untuk operasi tulis

### Error: "Upload preset not found" (Cloudinary)

**Solusi:**
1. Pastikan upload preset sudah dibuat di Cloudinary
2. Cek **Signing Mode: Unsigned**
3. Verify nama preset di `.env.local` benar

### Error: "Cloudinary configuration not found"

**Solusi:**
1. Pastikan `.env.local` sudah dibuat
2. Restart server: `Ctrl+C` → `npm run dev`
3. Clear browser cache

### Upload ke Cloudinary gagal

**Solusi:**
1. Cek ukuran file < 10MB
2. Format file didukung: JPG, PNG, WebP, GIF, MP4
3. Periksa koneksi internet
4. Verify credentials di `.env.local`

---

## Checklist Setup

- [ ] Firebase project dibuat
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user dibuat di Authentication
- [ ] Firestore Database dibuat
- [ ] Firestore Rules diterapkan
- [ ] Cloudinary account dibuat
- [ ] Cloudinary credentials didapat
- [ ] Upload preset dibuat (unsigned)
- [ ] `.env.local` diisi dengan Firebase + Cloudinary config
- [ ] Firebase Storage **TIDAK** dibuat (tidak perlu)
- [ ] Test upload ke Cloudinary berhasil

---

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)
- [Firestore Security Rules](./FIREBASE_SECURITY_RULES.md)
- [Quick Start Guide](./QUICK_START.md)

---

**Selamat! Firebase dan Cloudinary sudah siap digunakan! 🎉**

Lanjutkan dengan menjalankan `npm run dev` dan buka `/admin` untuk login.
