# 🔄 Perubahan Storage: Firebase Storage → Cloudinary

## ⚠️ Update Penting

Firebase Storage **tidak lagi menawarkan "test mode"** seperti sebelumnya. Sebagai alternatif, aplikasi ini sekarang menggunakan **Cloudinary** untuk penyimpanan file (gambar/video).

---

## 📊 Perbandingan

| Fitur | Firebase Storage (Spark Plan) | Cloudinary (Free Plan) |
|-------|-------------------------------|------------------------|
| **Storage** | 5GB total | **25GB** ✅ |
| **Bandwidth** | 1GB/hari | **25GB/bulan** ✅ |
| **Image Optimization** | Manual | **Auto** ✅ |
| **CDN** | Regional | **Global** ✅ |
| **Transformations** | Manual | **Unlimited** ✅ |
| **Upload Widget** | ❌ | **✅** |
| **Credit Card** | Required untuk upgrade | **Not Required** ✅ |

---

## 🆕 File Baru yang Ditambahkan

### 1. Cloudinary Library
```
src/lib/cloudinary/index.ts
```
Utility functions untuk:
- Upload file ke Cloudinary
- Generate transformed URLs
- Get thumbnail/full-size URLs
- Delete files (via API)

### 2. Cloudinary Setup Guide
```
CLOUDINARY_SETUP.md
```
Panduan lengkap setup Cloudinary dari awal.

### 3. Updated Documentation
```
FIREBASE_SETUP.md          - Updated tanpa Firebase Storage
FIREBASE_SECURITY_RULES.md - Hanya Firestore rules (no Storage)
.env.local                 - Added Cloudinary variables
```

---

## 🔧 Perubahan Code

### 1. Firebase Hooks (`src/lib/firebase/hooks.ts`)

**Sebelum:**
```typescript
import { uploadFile, deleteFile } from './storage';

const upload = async (file: File, path: string) => {
  const result = await uploadFile(file, path, ...);
  // ...
};
```

**Sesudah:**
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

const upload = async (file: File, path: string = 'invitation-app') => {
  const result = await uploadToCloudinary(file, path, ...);
  // ...
};
```

### 2. Gallery Hook

Upload gallery sekarang menggunakan Cloudinary:
```typescript
const addGalleryItemImage = async (file: File, urutan: number) => {
  // Upload ke Cloudinary
  const uploadResult = await uploadToCloudinary(file, 'images/gallery');
  
  // Simpan URL ke Firestore
  return await addGalleryItem({ imageUrl: uploadResult.url, urutan });
};
```

### 3. Environment Variables (`.env.local`)

**Ditambahkan:**
```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invitation-uploads
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📝 Yang TIDAK Berubah

### Firebase Services yang Tetap Sama:
- ✅ **Authentication** - Email/Password login
- ✅ **Firestore Database** - Data storage untuk config, flashback, gallery, guests
- ✅ **Security Rules** - Firestore rules only (no Storage rules)

### Application Features:
- ✅ Semua fitur tetap berfungsi sama
- ✅ Admin dashboard tetap sama
- ✅ User experience tidak berubah
- ✅ Upload flow tetap sama dari perspektif user

---

## 🚀 Setup Steps (Updated)

### 1. Firebase Setup (Tanpa Storage)

```bash
# Firebase Console:
1. Buat Firebase Project
2. Enable Authentication (Email/Password)
3. Buat Firestore Database
4. Setup Firestore Security Rules
5. ❌ SKIP Firebase Storage (tidak perlu)
6. Dapatkan Firebase Config
7. Update .env.local
```

### 2. Cloudinary Setup

```bash
# Cloudinary Console:
1. Daftar di cloudinary.com (FREE plan)
2. Copy Cloud Name, API Key, API Secret
3. Buat Upload Preset (Unsigned)
4. Update .env.local dengan Cloudinary credentials
```

### 3. Install & Run

```bash
npm install
npm run dev
```

---

## 🎯 Upload Flow (New)

```
User Upload di Admin Dashboard
         ↓
File dikirim ke Cloudinary API
         ↓
Cloudinary menyimpan & optimize
         ↓
Cloudinary return URL
         ↓
URL disimpan ke Firestore
         ↓
Gambar ditampilkan dari Cloudinary CDN
```

---

## 📁 File Structure (Updated)

```
my-invitation-app/
├── src/
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── hooks.ts         # Updated: use Cloudinary
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── config.ts
│   │   └── cloudinary/          # NEW
│   │       └── index.ts         # Cloudinary utilities
├── .env.local                   # Updated: +Cloudinary vars
├── CLOUDINARY_SETUP.md          # NEW
├── FIREBASE_SETUP.md            # Updated
└── FIREBASE_SECURITY_RULES.md   # Updated (no Storage)
```

---

## ✅ Migration Checklist

Jika Anda sudah punya project lama:

- [ ] Install Cloudinary: `npm install cloudinary @cloudinary/url-gen`
- [ ] Buat akun Cloudinary (FREE plan)
- [ ] Dapatkan credentials dari Cloudinary dashboard
- [ ] Buat Upload Preset (Unsigned mode)
- [ ] Update `.env.local` dengan Cloudinary credentials
- [ ] Update code untuk gunakan `uploadToCloudinary` instead of `uploadFile`
- [ ] Test upload gambar
- [ ] **TIDAK PERLU** migrate file lama (bisa tetap pakai Firebase Storage jika mau)

---

## 💡 Tips

### 1. Image Optimization

Cloudinary auto-optimize gambar:
```javascript
// Original URL
https://res.cloudinary.com/xyz/image/upload/photo.jpg

// Auto-optimize
https://res.cloudinary.com/xyz/image/upload/f_auto,q_auto/photo.jpg
```

### 2. Transformations

Resize gambar via URL:
```javascript
// Thumbnail
https://res.cloudinary.com/xyz/image/upload/w_300,h_300,c_fill/photo.jpg

// Full size
https://res.cloudinary.com/xyz/image/upload/w_1200,q_auto/photo.jpg
```

### 3. Bandwidth Saving

Cloudinary CDN otomatis compress gambar tanpa mengurangi kualitas, menghemat bandwidth loading.

---

## 🔒 Security

### Cloudinary Security Features:
- ✅ **Unsigned upload preset** - Client can upload without API secret
- ✅ **Folder restrictions** - Files organized in folders
- ✅ **File type validation** - Only images/videos allowed
- ✅ **Size limits** - Max 10MB per file (configurable)
- ✅ **Unique filenames** - Prevent overwriting

### Firestore Security:
- ✅ Only authenticated users can write to config, flashback, gallery
- ✅ Public can read and create guest messages
- ✅ Only admin can delete guest messages

---

## 📊 Free Tier Limits

### Cloudinary Free Plan:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: Unlimited
- **Uploads**: Unlimited
- **Media Entries**: Up to 25,000

**Estimasi untuk undangan:**
- 20 foto galeri × 500KB = 10MB
- 2 foto pengantin × 500KB = 1MB
- 5 flashback × 500KB = 2.5MB
- **Total**: ~13.5MB per undangan

**Bisa handle ~1,800 undangan dengan 25GB!**

---

## 🆘 Troubleshooting

### Upload gagal dengan error "Upload preset not found"
- Pastikan upload preset sudah dibuat di Cloudinary
- Cek **Signing Mode: Unsigned**
- Verify nama preset di `.env.local` benar

### Error "Cloudinary configuration not found"
- Pastikan `.env.local` sudah dibuat
- Restart server setelah edit env
- Clear browser cache

### Gambar tidak muncul
- Cek URL di browser
- Pastikan Cloud Name benar
- Clear CDN cache

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Pricing](https://cloudinary.com/pricing)

---

## ✨ Kesimpulan

**Keuntungan migrasi ke Cloudinary:**
- ✅ Storage lebih besar (25GB vs 5GB)
- ✅ Bandwidth lebih besar (25GB/month vs 1GB/day)
- ✅ Auto image optimization
- ✅ Global CDN
- ✅ Unlimited transformations
- ✅ Tidak perlu credit card
- ✅ Upload widget yang lebih baik

**Aplikasi sekarang 100% menggunakan services GRATIS dengan kapasitas yang lebih besar!** 🎉

---

Updated: March 25, 2025
