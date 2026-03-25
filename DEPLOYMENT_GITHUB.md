# 🚀 Panduan Deploy & Online-kan Undangan Digital

Panduan lengkap untuk mengupload proyek ke GitHub dan mengonlinekan secara GRATIS menggunakan **Vercel** (untuk Next.js) dan **Firebase** (untuk Backend).

---

## 📋 Prerequisites

Sebelum mulai, pastikan Anda sudah memiliki:

1. ✅ **Akun GitHub** - [github.com](https://github.com)
2. ✅ **Akun Vercel** - [vercel.com](https://vercel.com) (bisa login dengan GitHub)
3. ✅ **Firebase Project** - Sudah dibuat dan dikonfigurasi
4. ✅ **Node.js** - Versi 18 atau lebih baru

---

## 📁 Langkah 1: Persiapan Proyek

### 1.1 Cek File `.env.local`

Pastikan file `.env.local` sudah berisi konfigurasi Firebase yang benar:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

⚠️ **PENTING**: File `.env.local` **TIDAK BOLEH** diupload ke GitHub (sudah ada di `.gitignore`).

### 1.2 Buat File `.env.example`

Buat file baru bernama `.env.example` (tanpa nilai sensitif):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

---

## 🐙 Langkah 2: Upload ke GitHub

### 2.1 Inisialisasi Git (jika belum)

Buka terminal di folder proyek dan jalankan:

```bash
git init
```

### 2.2 Tambahkan Semua File

```bash
git add .
```

### 2.3 Commit Pertama

```bash
git commit -m "Initial commit - Undangan Digital"
```

### 2.4 Buat Repository di GitHub

1. Buka [github.com/new](https://github.com/new)
2. Isi nama repository (contoh: `my-invitation-app`)
3. Pilih **Private** atau **Public** (sesuai keinginan)
4. **JANGAN** centang "Add README" atau lainnya
5. Klik **Create repository**

### 2.5 Hubungkan ke GitHub

Copy command dari GitHub, contoh:

```bash
git remote add origin https://github.com/USERNAME/my-invitation-app.git
git branch -M main
git push -u origin main
```

✅ **Repository GitHub sudah siap!**

---

## ⚡ Langkah 3: Deploy ke Vercel (GRATIS)

### 3.1 Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **Login** → pilih **Continue with GitHub**

### 3.2 Import Proyek

1. Klik **Add New Project**
2. Pilih **Import Git Repository**
3. Cari repository `my-invitation-app` yang baru dibuat
4. Klik **Import**

### 3.3 Konfigurasi Build

Di halaman konfigurasi:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (otomatis terdeteksi) |
| **Root Directory** | `./` (default) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |

### 3.4 Tambahkan Environment Variables

Klik **Environment Variables** → **Add Variable** → Tambahkan satu per satu:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | (dari .env.local) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | (dari .env.local) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | (dari .env.local) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | (dari .env.local) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | (dari .env.local) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | (dari .env.local) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | (dari .env.local) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | (dari .env.local) |

✅ **Copy semua nilai dari file `.env.local` di komputer Anda**

### 3.5 Deploy!

1. Klik **Deploy**
2. Tunggu proses build (±2-5 menit)
3. Jika sukses, akan muncul **✅ Congratulations!**

### 3.6 Akses Website

Setelah deploy selesai, Anda akan mendapat URL:
```
https://my-invitation-app.vercel.app
```

✅ **Website sudah ONLINE!**

---

## 🔥 Langkah 4: Konfigurasi Firebase

### 4.1 Firebase Authentication

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Menu **Authentication** → **Sign-in method**
4. Enable **Email/Password**

### 4.2 Buat Akun Admin

Di **Authentication** → **Users** → **Add User**:
- Email: `admin@undangan.com`
- Password: (buat password kuat)

### 4.3 Firestore Database

1. Menu **Firestore Database** → **Create Database**
2. Pilih **Start in Test Mode** (untuk development)
3. Pilih lokasi: `asia-southeast1` (Singapore)

### 4.4 Firestore Security Rules

Menu **Firestore Database** → **Rules**:

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
    
    // Guests - semua bisa tulis (untuk ucapan)
    match /guests/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

### 4.5 Firebase Storage

1. Menu **Storage** → **Get Started**
2. Pilih **Start in Test Mode**
3. Pilih lokasi yang sama dengan Firestore

### 4.6 Storage Security Rules

Menu **Storage** → **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🌐 Langkah 5: Custom Domain (Opsional)

### 5.1 Beli Domain

Beli domain di penyedia seperti:
- [Niagahoster](https://niagahoster.co.id)
- [Domainesia](https://domainsesia.com)
- [Namecheap](https://namecheap.com)

### 5.2 Tambahkan ke Vercel

1. Buka project di Vercel
2. Menu **Settings** → **Domains**
3. Tambahkan domain Anda (contoh: `undangan.com`)
4. Ikuti instruksi untuk setting DNS

### 5.3 Setting DNS

Di penyedia domain, tambahkan record:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

✅ **Domain custom siap!**

---

## ✅ Langkah 6: Testing & Troubleshooting

### 6.1 Test Website

Buka URL Vercel dan cek:
- [ ] Cover halaman tampil dengan countdown
- [ ] Tombol "Buka Undangan" berfungsi
- [ ] Musik background play
- [ ] Semua section (pengantin, lokasi, gallery, ucapan) tampil
- [ ] Form ucapan berfungsi
- [ ] Upload foto di admin berfungsi

### 6.2 Test Admin Dashboard

1. Buka `https://your-app.vercel.app/admin`
2. Login dengan email admin yang dibuat di Firebase
3. Cek semua fitur admin:
   - [ ] Update konfigurasi
   - [ ] Upload foto pengantin
   - [ ] Tambah flashback
   - [ ] Upload gallery
   - [ ] Lihat ucapan tamu
   - [ ] Export Excel

### 6.3 Common Issues & Solutions

#### ❌ Error: "Firebase not configured"
**Solusi**: Cek Environment Variables di Vercel sudah benar semua.

#### ❌ Error: "404 Not Found" di admin/dashboard
**Solusi**: 
```bash
# Di lokal, build dan test
npm run build
npm start
```

#### ❌ Gambar tidak muncul
**Solusi**: 
- Cek Cloudinary setup sudah benar
- Cek `CLOUDINARY_CLOUD_NAME` dan `CLOUDINARY_UPLOAD_PRESET`

#### ❌ Ucapan tidak terkirim
**Solusi**: 
- Cek Firestore Rules sudah benar
- Cek Firebase project ID benar

#### ❌ Countdown timer tidak muncul
**Solusi**: 
- Hard refresh browser (Ctrl+Shift+R)
- Cek console untuk error

---

## 🔄 Langkah 7: Update Website

### 7.1 Update di Lokal

```bash
# Edit file yang diinginkan
# Contoh: ubah warna di GuestBookSection.tsx

# Commit perubahan
git add .
git commit -m "Update warna teks ucapan"
git push origin main
```

### 7.2 Auto Deploy di Vercel

Vercel akan **otomatis deploy** setiap ada push ke GitHub!

Tunggu ±2-3 menit, update sudah live.

---

## 📊 Monitoring & Analytics

### 7.1 Vercel Analytics

1. Buka project di Vercel
2. Menu **Analytics**
3. Lihat traffic, performance, dll.

### 7.2 Firebase Analytics

1. Buka Firebase Console
2. Menu **Analytics**
3. Lihat user activity

---

## 🎯 Checklist Final

Sebelum membagikan undangan, pastikan:

- [ ] Website sudah deploy dengan sukses
- [ ] Semua halaman bisa diakses
- [ ] Countdown timer berjalan
- [ ] Musik background berfungsi
- [ ] Form ucapan berfungsi
- [ ] Admin dashboard bisa diakses
- [ ] Upload gambar berfungsi
- [ ] Export Excel berfungsi
- [ ] Mobile responsive (cek di HP)
- [ ] Loading cepat (<3 detik)

---

## 📞 Support

Jika ada masalah:

1. **Cek Vercel Logs**: Menu **Deployments** → klik deployment → **View Build Logs**
2. **Cek Firebase Console**: Menu **Firestore** / **Storage** / **Authentication**
3. **Browser Console**: Tekan F12 → tab **Console**

---

## 🎉 Selesai!

Website undangan Anda sudah ONLINE dan siap dibagikan!

**URL Website**: `https://your-app.vercel.app`
**URL Admin**: `https://your-app.vercel.app/admin`

---

## 💡 Tips Tambahan

1. **Backup Data**: Export ucapan tamu secara berkala via Excel
2. **Testing**: Test di berbagai device (HP, tablet, desktop)
3. **Performance**: Optimasi ukuran gambar sebelum upload
4. **Security**: Ganti password admin secara berkala
5. **Monitoring**: Cek Vercel analytics untuk traffic

---

**Good Luck! 🚀**
