# 🚀 Quick Start Guide - Undangan Digital

## Langkah Cepat Memulai Aplikasi

### 1️⃣ Setup Firebase (5 menit)

#### A. Buat Proyek Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Masukkan nama: `my-invitation-app`
4. Nonaktifkan Google Analytics (opsional)
5. Klik **"Create project"** → **"Continue"**

#### B. Setup Authentication
1. Di sidebar: **Build** → **Authentication** → **Get started**
2. Tab **Sign-in method** → **Email/Password** → **Enable** → **Save**
3. Tab **Users** → **Add user**
   - Email: `admin@example.com` (ganti dengan email Anda)
   - Password: `password123` (ganti dengan password aman)
   - Klik **Add user**

#### C. Buat Firestore Database
1. **Build** → **Firestore Database** → **Create database**
2. Pilih **Start in test mode**
3. Lokasi: **asia-southeast1** (Singapore) atau terdekat
4. Klik **Enable**

#### D. Buat Storage
1. **Build** → **Storage** → **Get started**
2. Pilih **Start in test mode**
3. Klik **Next** → **Done**

#### E. Setup Security Rules

**Firestore Rules:**
1. Buka **Firestore Database** → tab **Rules**
2. Copy-paste rules ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /flashback/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /guests/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

**Storage Rules:**
1. Buka **Storage** → tab **Rules**
2. Copy-paste rules ini:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /music/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

#### F. Dapatkan Firebase Config
1. Klik ikon **gear (⚙️)** → **Project settings**
2. Scroll ke **Your apps**
3. Klik ikon **Web (</>)**
4. App nickname: `my-invitation-app`
5. Klik **Register app**
6. **Copy** nilai `firebaseConfig`

---

### 2️⃣ Setup Environment (2 menit)

#### A. Edit File .env.local

Buka file `.env.local` dan paste nilai dari Firebase:

```env
# Dari firebaseConfig object yang Anda copy:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Untuk API routes (opsional - bisa diisi nanti)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Cara mendapatkan Service Account (untuk API routes):**
1. Project Settings → Service Accounts
2. Klik **Generate new private key**
3. Download file JSON
4. Buka file JSON, copy nilai:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

---

### 3️⃣ Jalankan Aplikasi (1 menit)

```bash
# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Buka browser: **http://localhost:3000**

---

### 4️⃣ Login ke Admin Dashboard

1. Buka: **http://localhost:3000/admin**
2. Login dengan email dan password yang dibuat di langkah 1B
3. Mulai isi data undangan!

---

### 5️⃣ Isi Konten Undangan

#### Tab Konfigurasi:
- ✅ Salam (Arab)
- ✅ Nama Acara
- ✅ Ayat Al-Qur'an
- ✅ URL Background Cover (opsional)
- ✅ URL Musik Latar (opsional)

#### Tab Pengantin:
- ✅ Nama lengkap pengantin pria
- ✅ Nama orangtua pengantin pria
- ✅ URL foto pengantin pria (atau upload nanti)
- ✅ Nama lengkap pengantin wanita
- ✅ Nama orangtua pengantin wanita
- ✅ URL foto pengantin wanita

#### Tab Lokasi:
- ✅ Nama lokasi acara
- ✅ Waktu/tanggal acara
- ✅ Link Google Maps

#### Tab Flashback:
- ✅ Tambah momen flashback (judul, deskripsi, foto opsional)

#### Tab Galeri:
- ✅ Upload foto (max 20 foto, max 10MB each)

#### Tab Tampilan:
- ✅ Bentuk bunga (emoji)
- ✅ Warna bunga
- ✅ Kecepatan animasi
- ✅ Intensitas bunga

---

### 6️⃣ Test Aplikasi

#### Test sebagai User:
1. Buka **http://localhost:3000**
2. Klik **"Buka Undangan"**
3. Scroll melalui setiap section
4. Test klik foto galeri (lightbox)
5. Kirim ucapan di Guest Book
6. Cek ucapan muncul realtime

#### Test sebagai Admin:
1. Update data di dashboard
2. Refresh halaman utama
3. Lihat perubahan

---

## 🎯 Checklist Setup

- [ ] Firebase project dibuat
- [ ] Authentication enabled
- [ ] Admin user dibuat
- [ ] Firestore database dibuat
- [ ] Firestore rules diterapkan
- [ ] Storage dibuat
- [ ] Storage rules diterapkan
- [ ] File `.env.local` dibuat
- [ ] Environment variables diisi
- [ ] Dependencies terinstall
- [ ] Development server berjalan
- [ ] Admin dashboard bisa diakses
- [ ] Data bisa disimpan
- [ ] Ucapan realtime berfungsi

---

## 🔗 URL Penting

- **Halaman Utama**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Firebase Console**: https://console.firebase.google.com/

---

## 💡 Tips

### Menambah Background Cover
1. Upload gambar ke Firebase Storage
2. Copy download URL
3. Paste di field "URL Background Cover"

### Menambah Musik Latar
1. Upload file audio (MP3) ke Storage
2. Copy download URL
3. Paste di field "URL Musik Latar"
4. Format yang didukung: MP3, WAV

### Upload Foto
- Ukuran maksimal: 10MB
- Format: JPG, PNG, WebP
- Rekomendasi: compress foto untuk loading lebih cepat

### Kustomisasi Warna
Edit file `app/globals.css`, ubah variable CSS:
```css
:root {
  --primary: #10b981;  /* Ganti dengan warna pilihan */
}
```

---

## ❓ Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Tambahkan `localhost` ke Authorized Domains
- Firebase Console → Authentication → Settings → Authorized domains

### "Missing or insufficient permissions"
- Periksa Firestore Rules sudah dipublish
- Periksa Storage Rules sudah dipublish

### Data tidak muncul
- Pastikan environment variables benar
- Restart server: `Ctrl+C` → `npm run dev`
- Clear browser cache

### Upload gagal
- Periksa Storage Rules
- Cek ukuran file (max 10MB)
- Pastikan sudah login sebagai admin

---

## 📚 Dokumentasi Lengkap

- `README.md` - Dokumentasi utama
- `FIREBASE_SETUP.md` - Panduan detail Firebase
- `DEPLOYMENT.md` - Cara deploy ke production
- `PROJECT_SUMMARY.md` - Ringkasan proyek

---

**Selamat! Aplikasi undangan digital Anda siap digunakan! 🎉**

Untuk deploy ke production, lihat file `DEPLOYMENT.md`.
