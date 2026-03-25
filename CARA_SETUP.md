# 🚀 CARA SETUP APLIKASI UNDANGAN

## ⚠️ PENTING: Halaman Admin Kosong/Error?

Ini karena **Firebase configuration belum diisi** di file `.env.local`.

---

## 📋 Langkah 1: Isi Firebase Credentials

### A. Buka Firebase Console
1. Buka https://console.firebase.google.com/
2. Login dengan akun Google Anda
3. Klik **"Add project"** atau pilih project yang sudah ada

### B. Dapatkan Firebase Config
1. Klik ikon **gear (⚙️)** → **Project settings**
2. Scroll ke bagian **"Your apps"**
3. Jika belum ada web app, klik ikon **Web (</>)** 
4. Beri nama app (misal: `my-invitation-app`)
5. **Copy** nilai `firebaseConfig` yang muncul

### C. Edit File .env.local

Buka file `.env.local` dan paste nilai dari Firebase:

```env
# Ganti nilai-nilai di bawah dengan dari Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Cloudinary (untuk upload gambar - GRATIS 25GB)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invitation-uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**⚠️ TIDAK PERLU Measurement ID** - itu opsional untuk Google Analytics.

---

## 📋 Langkah 2: Buat Admin User di Firebase

1. Di Firebase Console → **Authentication**
2. Klik **"Get started"** jika belum enabled
3. Tab **"Sign-in method"** → Enable **Email/Password**
4. Tab **"Users"** → **"Add user"**
   - Email: `admin@example.com` (ganti dengan email Anda)
   - Password: `password123` (ganti dengan password aman)
5. Klik **"Add user"**

---

## 📋 Langkah 3: Setup Cloudinary (Untuk Upload Gambar)

### Daftar Cloudinary (GRATIS 25GB):
1. Buka https://cloudinary.com/users/register/free
2. Daftar dengan email (FREE plan)
3. Di dashboard, copy:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### Buat Upload Preset:
1. Klik **Settings (⚙️)** → **Upload**
2. Scroll ke **Upload presets** → **Add upload preset**
3. Isi:
   - **Preset name**: `invitation-uploads`
   - **Signing Mode**: **Unsigned** ← PENTING!
   - **Folder**: `invitation-app`
4. Klik **Save**
5. Copy nama preset

### Update .env.local dengan Cloudinary credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo  # ganti dengan cloud name Anda
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invitation-uploads
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop
```

---

## 📋 Langkah 4: Setup Firestore Database

1. Firebase Console → **Firestore Database**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"**
4. Lokasi: **asia-southeast1** (Singapore) atau terdekat
5. Klik **"Enable"**

### Setup Security Rules:
1. Buka tab **Rules**
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

3. Klik **"Publish"**

---

## 📋 Langkah 5: Jalankan & Test

### Restart Server:
```bash
# Stop server (Ctrl+C)
# Lalu jalankan lagi:
npm run dev
```

### Test:
1. Buka http://localhost:3000
2. Login ke admin: http://localhost:3000/admin
3. Gunakan email & password yang dibuat di Langkah 2
4. Jika berhasil login, Anda akan melihat dashboard admin

---

## ✅ Checklist Setup

- [ ] Firebase project dibuat
- [ ] Firebase config di-copy ke .env.local
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user dibuat di Authentication
- [ ] Firestore Database dibuat
- [ ] Firestore Rules diterapkan
- [ ] Cloudinary account dibuat
- [ ] Cloudinary credentials di-copy ke .env.local
- [ ] Upload preset dibuat (Unsigned mode)
- [ ] Server di-restart
- [ ] Bisa login ke admin dashboard

---

## 🔧 Troubleshooting

### Halaman admin masih kosong?
1. Buka **Developer Console** di browser (F12)
2. Lihat ada error apa di Console
3. Pastikan `.env.local` sudah diisi dengan benar
4. Restart server: `Ctrl+C` → `npm run dev`

### Error: "Firebase: Error (auth/invalid-api-key)"?
- Copy ulang Firebase config dari Firebase Console
- Pastikan tidak ada typo di `.env.local`
- Restart server

### Error: "Upload preset not found"?
- Pastikan upload preset sudah dibuat di Cloudinary
- Cek **Signing Mode: Unsigned**
- Verify nama preset di `.env.local` benar

### Login gagal dengan "user not found"?
- Pastikan admin user sudah dibuat di Firebase Authentication
- Cek email dan password benar

---

## 📖 Dokumentasi Lengkap

- **`QUICK_START.md`** - Panduan cepat
- **`FIREBASE_SETUP.md`** - Setup Firebase detail
- **`CLOUDINARY_SETUP.md`** - Setup Cloudinary detail
- **`DEPLOYMENT.md`** - Deploy ke production

---

## 🎉 Setelah Setup Berhasil

1. Login ke admin dashboard
2. Isi data undangan:
   - Konfigurasi (salam, nama acara, ayat)
   - Data pengantin + foto
   - Lokasi & waktu
   - Flashback
   - Galeri foto
   - Atur tampilan bunga
3. Test di browser: http://localhost:3000
4. Deploy ke production (lihat `DEPLOYMENT.md`)

---

**Selamat! Aplikasi undangan digital siap digunakan! 🎊**
