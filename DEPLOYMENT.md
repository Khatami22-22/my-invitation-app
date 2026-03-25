# 📱 Digital Invitation App - Deployment Guide

## 🚀 Langkah Upload ke GitHub

### 1. Inisialisasi Git Repository

Jika belum ada repository Git:

```bash
# Cek status git
git status

# Jika belum initialized, jalankan:
git init
```

### 2. Buat File .gitignore

Pastikan file `.gitignore` sudah ada dan berisi:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

### 3. Commit Perubahan

```bash
# Tambahkan semua file
git add .

# Commit dengan pesan
git commit -m "Initial commit: Digital Invitation App"
```

### 4. Buat Repository di GitHub

1. Buka [GitHub](https://github.com)
2. Login ke akun Anda
3. Klik tombol **"+"** di pojok kanan atas
4. Pilih **"New repository"**
5. Isi nama repository (misal: `my-invitation-app`)
6. Pilih visibility (Public/Private)
7. **Jangan** centang "Initialize this repository with a README"
8. Klik **"Create repository"**

### 5. Push ke GitHub

```bash
# Tambahkan remote repository (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/my-invitation-app.git

# Push ke branch main
git branch -M main
git push -u origin main
```

### 6. Update Repository (Untuk Perubahan Selanjutnya)

```bash
# Setelah melakukan perubahan
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

---

## 🔐 Mengatur Environment Variables di GitHub

Jika Anda menggunakan GitHub Actions atau ingin menyimpan environment variables dengan aman:

1. Buka repository Anda di GitHub
2. Klik tab **"Settings"**
3. Di sidebar kiri, pilih **"Secrets and variables"** → **"Actions"**
4. Klik **"New repository secret"**
5. Tambahkan secrets berikut:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🌐 Deploy ke Vercel

### Cara 1: Deploy Langsung dari GitHub

1. Buka [Vercel](https://vercel.com)
2. Login dengan akun GitHub
3. Klik **"Add New Project"**
4. Pilih **"Import Git Repository"**
5. Pilih repository `my-invitation-app`
6. Klik **"Import"**
7. Konfigurasi:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
8. Tambahkan **Environment Variables** (klik "Environment Variables"):
   - Tambahkan semua variabel dari `.env.local`
9. Klik **"Deploy"**

### Cara 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

---

## 📦 Deploy ke Platform Lain

### Netlify

1. Buka [Netlify](https://netlify.com)
2. Login dengan GitHub
3. Klik **"Add new site"** → **"Import an existing project"**
4. Pilih repository
5. Konfigurasi build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Tambahkan environment variables
7. Klik **"Deploy site"**

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Pilih options:
# - Use an existing project
# - Public directory: .next
# - Configure as single-page app: No
# - Set up automatic builds: Yes

# Deploy
firebase deploy
```

---

## ✅ Checklist Sebelum Deploy

- [ ] Semua environment variables sudah diatur
- [ ] Firebase Security Rules sudah diterapkan
- [ ] Testing lokal sudah berhasil
- [ ] File `.env.local` tidak ter-commit ke GitHub
- [ ] Semua fitur sudah berfungsi dengan baik
- [ ] Admin user sudah dibuat di Firebase Authentication

---

## 🔧 Troubleshooting

### Build Failed di Vercel

**Masalah:** Build gagal karena environment variables tidak ditemukan

**Solusi:**
1. Pastikan semua environment variables sudah ditambahkan di Vercel Settings
2. Restart deployment setelah menambahkan variables

### Firebase Connection Error

**Masalah:** Aplikasi tidak bisa connect ke Firebase

**Solusi:**
1. Cek environment variables sudah benar
2. Pastikan Firestore dan Storage sudah di-enable di Firebase Console
3. Periksa Firebase Security Rules

### 404 Error Setelah Deploy

**Masalah:** Halaman admin atau API routes mengembalikan 404

**Solusi:**
1. Pastikan struktur folder `src/app` sudah benar
2. Restart deployment
3. Clear cache browser

---

## 📞 Support

Jika mengalami masalah:
1. Cek dokumentasi Next.js: https://nextjs.org/docs
2. Cek dokumentasi Firebase: https://firebase.google.com/docs
3. Buka issue di repository GitHub

---

## 📝 License

This project is open source and available under the MIT License.
