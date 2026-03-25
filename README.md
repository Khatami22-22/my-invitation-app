# 💍 Digital Invitation App

Aplikasi undangan pernikahan digital yang modern dan interaktif, dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Firebase.

## ✨ Fitur Utama

### 🎨 Untuk Tamu Undangan

- **Halaman Cover Menarik** - Dengan animasi pembuka dan tombol "Buka Undangan"
- **Musik Latar** - Background music yang otomatis berputar saat undangan dibuka
- **Profil Pengantin** - Informasi lengkap tentang mempelai pria dan wanita
- **Lokasi & Waktu** - Peta interaktif dengan navigasi ke lokasi
- **Flashback** - Galeri momen-momen spesial
- **Galeri Foto** - Hingga 20 foto dengan fitur lightbox
- **Ucapan Realtime** - Kirim dan lihat ucapan secara langsung
- **Animasi Bunga** - Efek bunga jatuh yang dapat dikustomisasi
- **Responsive Design** - Tampilan optimal di semua device

### 🔐 Untuk Admin

- **Dashboard Admin** - Panel kontrol yang user-friendly
- **Manajemen Konten** - Edit semua konten undangan
- **Upload Foto** - Upload foto pengantin dan galeri
- **Kelola Ucapan** - Lihat dan hapus ucapan tamu
- **Kustomisasi Tampilan** - Atur warna, bentuk bunga, dan animasi
- **Realtime Updates** - Perubahan langsung terlihat

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
  - Realtime Updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Firebase account

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/my-invitation-app.git
cd my-invitation-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` dengan Firebase config Anda:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📖 Setup Firebase

### 1. Buat Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Ikuti wizard setup

### 2. Enable Authentication

1. Buka **Authentication** di Firebase Console
2. Klik **"Get started"**
3. Enable **Email/Password** sign-in method
4. Tambahkan admin user di tab **Users**

### 3. Buat Firestore Database

1. Buka **Firestore Database**
2. Klik **"Create database"**
3. Pilih **Start in test mode** (untuk development)
4. Pilih lokasi database

### 4. Buat Storage

1. Buka **Storage**
2. Klik **"Get started"**
3. Pilih **Start in test mode**
4. Selesaikan setup

### 5. Setup Security Rules

**Firestore Rules:**
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

**Storage Rules:**
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

Lihat [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) untuk panduan lengkap.

## 📁 Project Structure

```
my-invitation-app/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main invitation page
│   ├── globals.css          # Global styles
│   └── admin/               # Admin routes
│       ├── page.tsx         # Login page
│       ├── layout.tsx       # Admin layout
│       └── dashboard/
│           └── page.tsx     # Dashboard page
├── src/
│   ├── components/
│   │   ├── admin/           # Admin components
│   │   ├── sections/        # Page sections
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   └── firebase/        # Firebase config & utilities
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── .env.local              # Environment variables
```

## 🎯 Usage

### Admin Dashboard

1. Akses `/admin` untuk login
2. Gunakan email dan password yang sudah dibuat di Firebase Authentication
3. Kelola konten undangan melalui dashboard

### Main Invitation

1. Akses `/` untuk melihat undangan
2. Klik "Buka Undangan" untuk memulai
3. Scroll untuk melihat setiap section
4. Kirim ucapan di bagian Guest Book

## 🌐 Deployment

### Deploy ke Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Atau hubungkan repository GitHub ke Vercel untuk automatic deployment.

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deployment ke berbagai platform.

## 📱 Screenshots

### Invitation Page
- Cover dengan animasi pembuka
- Section pengantin dengan foto
- Peta lokasi interaktif
- Galeri flashback
- Galeri foto dengan lightbox
- Form ucapan realtime

### Admin Dashboard
- Login page
- Dashboard dengan tabs
- Form konfigurasi
- Upload manager
- Guest messages manager

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ using Next.js and Firebase

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for the backend services
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations
- React Icons for the icon library

---

**Happy Coding! 🎉**
