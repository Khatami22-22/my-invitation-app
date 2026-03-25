/**
 * TypeScript types for the Digital Invitation Application
 */

// Config document type
export interface WeddingConfig {
  id?: string;
  backgroundCover: string;
  salamArab: string;
  namaAcara: string;
  ayatQuran: string;
  musicUrl: string;
  pengantinPria: Pengantin;
  pengantinWanita: Pengantin;
  lokasi: Lokasi;
  bunga: BungaConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

// Pengantin (Couple) type
export interface Pengantin {
  foto: string;
  nama: string;
  namaOrtu: string;
}

// Lokasi (Location) type
export interface Lokasi {
  nama: string;
  waktu: string;
  linkMap: string;
  embedUrl?: string;
}

// Bunga (Flower) animation config
export interface BungaConfig {
  bentuk: string;
  warna: string;
  kecepatan: number;
  intensitas: number;
}

// Flashback type
export interface Flashback {
  id?: string;
  judul: string;
  deskripsi: string;
  gambar?: string;
  urutan: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Gallery item type
export interface GalleryItem {
  id?: string;
  imageUrl: string;
  urutan: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Guest message type
export interface GuestMessage {
  id?: string;
  nama: string;
  hadir: boolean;
  alamat?: string;
  ucapan: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth user type
export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

// Form types
export interface GuestForm {
  nama: string;
  hadir: boolean;
  alamat: string;
  ucapan: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

// Upload progress type
export interface UploadProgress {
  progress: number;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Component props types
export interface SectionProps {
  id?: string;
  className?: string;
}

export interface CoverSectionProps extends SectionProps {
  config: WeddingConfig;
  onOpen: () => void;
  isOpened: boolean;
}

export interface CoupleSectionProps extends SectionProps {
  config: WeddingConfig;
}

export interface LocationSectionProps extends SectionProps {
  config: WeddingConfig;
}

export interface FlashbackSectionProps extends SectionProps {
  flashbacks: Flashback[];
}

export interface GallerySectionProps extends SectionProps {
  gallery: GalleryItem[];
}

export interface GuestBookSectionProps extends SectionProps {
  onMessageAdded?: () => void;
}

// Falling flowers props
export interface FallingFlowersProps {
  config: BungaConfig;
  enabled?: boolean;
}
