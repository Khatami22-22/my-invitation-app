# 🌥️ Cloudinary Setup Guide - Storage Gratis untuk Aplikasi Undangan

## Mengapa Cloudinary?

Firebase Storage sekarang **tidak lagi menawarkan "test mode"** dan memerlukan upgrade ke plan berbayar untuk fitur lengkap. 

**Cloudinary** adalah alternatif yang **100% GRATIS** dengan:
- ✅ **25GB** storage gratis
- ✅ **25GB** bandwidth per bulan
- ✅ Unlimited transformations
- ✅ Upload widget yang mudah
- ✅ Auto-optimization untuk images
- ✅ CDN global untuk loading cepat

---

## 📋 Langkah 1: Buat Akun Cloudinary

1. Buka [Cloudinary.com](https://cloudinary.com/)
2. Klik **"Sign Up Free"**
3. Daftar dengan email atau login dengan GitHub/Google
4. **Pilih plan: FREE** (sudah cukup untuk aplikasi undangan)
5. Verifikasi email Anda

---

## 📋 Langkah 2: Dapatkan Credentials

Setelah login ke Cloudinary Console:

1. Di dashboard, Anda akan melihat:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

2. **Copy** ketiga nilai tersebut

3. Untuk mendapatkan **Upload Preset** (untuk upload tanpa backend):
   - Klik menu **Settings** (ikon gear) → **Upload**
   - Scroll ke **Upload presets**
   - Klik **"Add upload preset"**
   - Isi:
     - **Preset name**: `invitation-uploads` (atau nama lain)
     - **Signing Mode**: **Unsigned** (penting untuk client-side upload)
     - **Folder**: `invitation-app` (opsional, untuk organize file)
     - **Overwrite**: `false` (agar file dengan nama sama tidak tertimpa)
   - Klik **"Save"**
   - **Copy** nama preset yang dibuat

---

## 📋 Langkah 3: Update Environment Variables

Edit file `.env.local` dan tambahkan:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invitation-uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Catatan:**
- `NEXT_PUBLIC_` prefix berarti bisa diakses di client-side (browser)
- `CLOUDINARY_API_SECRET` hanya di server-side (untuk keamanan)

---

## 📋 Langkah 4: Update Firebase Setup (Tanpa Storage)

### Firebase Console Setup:

1. **Authentication** (tetap sama):
   - Enable Email/Password
   - Buat admin user

2. **Firestore Database** (tetap sama):
   - Create database
   - Pilih lokasi: `asia-southeast1` (Singapore)
   - **Mode: Production mode** (kita akan setup rules manual)

3. **Storage** (TIDAK PERLU lagi):
   - ❌ Tidak perlu membuat Firebase Storage
   - Kita akan menggunakan Cloudinary untuk semua file upload

---

## 📋 Langkah 5: Firestore Security Rules (Updated)

Karena kita tidak menggunakan Firebase Storage, rules hanya untuk Firestore:

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

**Cara apply rules:**
1. Firebase Console → Firestore Database → Rules
2. Paste rules di atas
3. Klik **Publish**

---

## 📋 Langkah 6: Update Code untuk Cloudinary

File storage sudah diupdate untuk menggunakan Cloudinary. Tidak perlu perubahan manual.

**Upload flow baru:**
1. User upload file di admin dashboard
2. File dikirim ke Cloudinary (via upload widget/API)
3. Cloudinary mengembalikan URL
4. URL disimpan di Firestore

---

## 📋 Langkah 7: Test Upload

1. Jalankan aplikasi: `npm run dev`
2. Login ke admin dashboard: `/admin`
3. Coba upload foto pengantin atau galeri
4. File akan tersimpan di Cloudinary, URL tersimpan di Firestore

---

## 🎯 Perbandingan: Firebase Storage vs Cloudinary

| Fitur | Firebase Storage | Cloudinary (Free) |
|-------|-----------------|-------------------|
| Storage | 5GB (Spark Plan) | **25GB** ✅ |
| Bandwidth | 1GB/hari | **25GB/bulan** ✅ |
| Image Optimization | Manual | **Auto** ✅ |
| CDN | Regional | **Global** ✅ |
| Transformations | Manual | **Unlimited** ✅ |
| Upload Widget | Tidak ada | **Ada** ✅ |
| Pricing | Pay-as-you-go | **Free tier cukup** ✅ |

---

## 💡 Tips Cloudinary

### 1. Image Transformations

Cloudinary mendukung transformasi URL:

```javascript
// Original URL
https://res.cloudinary.com/your-cloud/image/upload/v1234567890/invitation-app/photo.jpg

// Resize & optimize
https://res.cloudinary.com/your-cloud/image/upload/w_500,h_500,c_fill/invitation-app/photo.jpg

// Add watermark
https://res.cloudinary.com/your-cloud/image/upload/l_watermark.png/invitation-app/photo.jpg
```

### 2. Auto-Format

```javascript
// Auto format & quality
https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto/invitation-app/photo.jpg
```

### 3. Lazy Loading

```html
<img 
  src="https://res.cloudinary.com/your-cloud/image/upload/w_300,h_300/invitation-app/photo.jpg"
  loading="lazy"
/>
```

---

## 🔧 Troubleshooting

### Error: "Upload preset not found"
- Pastikan upload preset sudah dibuat
- Cek nama preset di `.env.local` sama persis
- Pastikan **Signing Mode: Unsigned**

### Error: "Cloud name not found"
- Cek `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` di `.env.local`
- Restart server setelah edit env

### Upload gagal
- Cek koneksi internet
- Pastikan file < 10MB (default limit Cloudinary)
- Format file didukung: JPG, PNG, WebP, GIF

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformations)
- [Pricing](https://cloudinary.com/pricing)

---

## ✅ Checklist Setup

- [ ] Akun Cloudinary dibuat
- [ ] Cloud Name, API Key, API Secret didapat
- [ ] Upload preset dibuat (unsigned)
- [ ] `.env.local` updated dengan Cloudinary credentials
- [ ] Firebase Storage TIDAK dibuat (tidak perlu)
- [ ] Firestore Rules updated (tanpa Storage rules)
- [ ] Test upload berhasil

---

**Selamat! Storage aplikasi Anda sekarang 100% GRATIS dengan Cloudinary! 🎉**

Untuk detail lebih lanjut, lihat dokumentasi Cloudinary atau tanyakan di dashboard admin.
