/**
 * Admin Dashboard Main Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useWeddingConfig, useFlashbacks, useGallery, useGuestMessages, useFileUpload } from '@/lib/firebase/hooks';
import { motion } from 'framer-motion';
import {
  FaCog,
  FaUsers,
  FaImages,
  FaHistory,
  FaMusic,
  FaPalette,
  FaMapMarkerAlt,
  FaSave,
  FaUpload,
  FaTrash,
  FaPlus,
  FaEdit,
  FaFileExcel,
} from 'react-icons/fa';
import { WeddingConfig, Flashback, GalleryItem, GuestMessage } from '@/types';
import * as XLSX from 'xlsx';

type Tab = 'config' | 'couple' | 'location' | 'flashback' | 'gallery' | 'guests' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const { config, loading: configLoading, updateConfig } = useWeddingConfig();
  const { flashbacks, addFlashback, updateFlashback, deleteFlashback } = useFlashbacks();
  const { gallery, addGallery, updateGallery, deleteGallery } = useGallery();
  const { messages, deleteMessage } = useGuestMessages();
  const { uploading, progress, upload } = useFileUpload();

  // Local state for config form
  const [formData, setFormData] = useState<Partial<WeddingConfig>>({
    salamArab: '',
    namaAcara: '',
    ayatQuran: '',
    backgroundCover: '',
    musicUrl: '',
    pengantinPria: { foto: '', nama: '', namaOrtu: '' },
    pengantinWanita: { foto: '', nama: '', namaOrtu: '' },
    lokasi: { nama: '', waktu: '', linkMap: '' },
    bunga: { bentuk: '🌸', warna: '#ffb7c5', kecepatan: 3, intensitas: 15 },
  });

  // Sync formData with config from Firebase (REALTIME)
  useEffect(() => {
    if (config) {
      console.log('📥 Syncing config from Firebase:', config);
      setFormData(config);
    }
  }, [config]);

  const handleConfigChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: 'pengantinPria' | 'pengantinWanita' | 'lokasi' | 'bunga', field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as object),
        [field]: value,
      },
    }));
  };

  const handleSaveConfig = async () => {
    if (!formData) return;
    
    console.log('💾 Saving config:', formData);
    const result = await updateConfig(formData as WeddingConfig);
    if (result.success) {
      alert('✅ Konfigurasi berhasil disimpan!\n\nData akan tetap tampil di form dan bisa diedit kembali.');
      console.log('✅ Config saved successfully');
    } else {
      alert('❌ Gagal menyimpan konfigurasi: ' + result.error);
      console.error('❌ Failed to save config:', result.error);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    subField?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    // Tentukan folder berdasarkan tipe file
    let folder = 'invitation-app';
    if (field === 'backgroundCover') folder = 'images/cover';
    else if (field === 'musicUrl') folder = 'music';
    else if (field.includes('pengantin')) folder = 'images/pengantin';
    else if (field === 'gambar') folder = 'images/flashback';

    const result = await upload(file, folder);
    if (result.success && result.url) {
      if (subField) {
        handleNestedChange(field as any, subField, result.url);
      } else {
        handleConfigChange(field, result.url);
      }
      alert('File berhasil diupload!');
    } else {
      alert('Gagal upload: ' + result.error);
    }
  };

  const tabs = [
    { id: 'config' as Tab, label: 'Konfigurasi', icon: FaCog },
    { id: 'couple' as Tab, label: 'Pengantin', icon: FaUsers },
    { id: 'location' as Tab, label: 'Lokasi', icon: FaMapMarkerAlt },
    { id: 'flashback' as Tab, label: 'Flashback', icon: FaHistory },
    { id: 'gallery' as Tab, label: 'Galeri', icon: FaImages },
    { id: 'guests' as Tab, label: 'Ucapan', icon: FaMusic },
    { id: 'settings' as Tab, label: 'Tampilan', icon: FaPalette },
  ];

  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-400">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-black border-b-4 border-black'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-400"
      >
        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">⚙️ Konfigurasi Umum</h2>

            <div>
              <label className="block text-base font-bold text-black mb-2">Salam (Arab)</label>
              <textarea
                value={formData.salamArab}
                onChange={(e) => handleConfigChange('salamArab', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                rows={2}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Nama Acara</label>
              <input
                type="text"
                value={formData.namaAcara}
                onChange={(e) => handleConfigChange('namaAcara', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                placeholder="Resepsi Pernikahan"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Ayat Al-Qur&apos;an</label>
              <textarea
                value={formData.ayatQuran}
                onChange={(e) => handleConfigChange('ayatQuran', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                rows={3}
                placeholder="Dan di antara tanda-tanda kekuasaan-Nya..."
              />
            </div>

            {/* Background Cover Upload */}
            <div>
              <label className="block text-base font-bold text-black mb-2">Background Cover</label>
              {formData.backgroundCover && (
                <div className="mb-2">
                  <img src={formData.backgroundCover} alt="Preview" className="w-full h-40 object-cover rounded-lg border-2 border-gray-400" />
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'backgroundCover')}
                    className="hidden"
                  />
                  <span className="flex items-center justify-center gap-2 w-full p-3 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white">
                    <FaUpload className="text-black" />
                    <span className="text-black font-medium">Upload Gambar</span>
                  </span>
                </label>
                {formData.backgroundCover && (
                  <button
                    onClick={() => handleConfigChange('backgroundCover', '')}
                    className="px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-sm text-black mt-1">Format: JPG, PNG, WebP (Max 10MB)</p>
            </div>

            {/* Music Upload */}
            <div>
              <label className="block text-base font-bold text-black mb-2">Musik Latar</label>
              {formData.musicUrl && (
                <div className="mb-2">
                  <audio controls src={formData.musicUrl} className="w-full" />
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'musicUrl')}
                    className="hidden"
                  />
                  <span className="flex items-center justify-center gap-2 w-full p-3 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white">
                    <FaUpload className="text-black" />
                    <span className="text-black font-medium">Upload Musik</span>
                  </span>
                </label>
                {formData.musicUrl && (
                  <button
                    onClick={() => handleConfigChange('musicUrl', '')}
                    className="px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-sm text-black mt-1">Format: MP3, WAV (Max 10MB)</p>
            </div>

            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <FaSave /> Simpan Konfigurasi
            </button>
          </div>
        )}

        {activeTab === 'couple' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">👰 Data Pengantin</h2>

            {/* Pengantin Pria */}
            <div className="border-2 border-gray-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-black mb-3">🤵 Pengantin Pria</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-base font-bold text-black mb-1">Foto</label>
                  {formData.pengantinPria?.foto && (
                    <div className="mb-2">
                      <img src={formData.pengantinPria.foto} alt="Preview" className="w-32 h-32 object-cover rounded-full border-2 border-gray-400" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'pengantinPria', 'foto')}
                        className="hidden"
                      />
                      <span className="flex items-center justify-center gap-2 w-full p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white">
                        <FaUpload className="text-black" />
                        <span className="text-black font-medium">Upload Foto</span>
                      </span>
                    </label>
                    {formData.pengantinPria?.foto && (
                      <button
                        onClick={() => handleNestedChange('pengantinPria', 'foto', '')}
                        className="px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-bold text-black mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.pengantinPria?.nama}
                    onChange={(e) => handleNestedChange('pengantinPria', 'nama', e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-black mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={formData.pengantinPria?.namaOrtu}
                    onChange={(e) => handleNestedChange('pengantinPria', 'namaOrtu', e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Pengantin Wanita */}
            <div className="border-2 border-gray-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-black mb-3">👰 Pengantin Wanita</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-base font-bold text-black mb-1">Foto</label>
                  {formData.pengantinWanita?.foto && (
                    <div className="mb-2">
                      <img src={formData.pengantinWanita.foto} alt="Preview" className="w-32 h-32 object-cover rounded-full border-2 border-gray-400" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'pengantinWanita', 'foto')}
                        className="hidden"
                      />
                      <span className="flex items-center justify-center gap-2 w-full p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white">
                        <FaUpload className="text-black" />
                        <span className="text-black font-medium">Upload Foto</span>
                      </span>
                    </label>
                    {formData.pengantinWanita?.foto && (
                      <button
                        onClick={() => handleNestedChange('pengantinWanita', 'foto', '')}
                        className="px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-bold text-black mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.pengantinWanita?.nama}
                    onChange={(e) => handleNestedChange('pengantinWanita', 'nama', e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-black mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={formData.pengantinWanita?.namaOrtu}
                    onChange={(e) => handleNestedChange('pengantinWanita', 'namaOrtu', e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <FaSave /> Simpan Data Pengantin
            </button>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">📍 Lokasi & Waktu</h2>

            <div>
              <label className="block text-base font-bold text-black mb-2">Nama Lokasi</label>
              <input
                type="text"
                value={formData.lokasi?.nama}
                onChange={(e) => handleNestedChange('lokasi', 'nama', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Waktu Acara</label>
              <input
                type="text"
                value={formData.lokasi?.waktu}
                onChange={(e) => handleNestedChange('lokasi', 'waktu', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                placeholder="Sabtu, 1 Januari 2025 - 10:00 WIB"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Link Google Maps</label>
              <input
                type="url"
                value={formData.lokasi?.linkMap}
                onChange={(e) => handleNestedChange('lokasi', 'linkMap', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                placeholder="https://www.google.com/maps/place/..."
              />
              <p className="text-sm text-gray-600 mt-1">
                Link untuk tombol "Menuju Lokasi"
              </p>
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Google Maps Embed (iframe)</label>
              <textarea
                value={formData.lokasi?.embedUrl || ''}
                onChange={(e) => handleNestedChange('lokasi', 'embedUrl', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                rows={3}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-sm text-black mt-2">
                💡 <strong>Cara mendapatkan embed URL:</strong>
              </p>
              <ol className="text-sm text-black list-decimal list-inside space-y-1 mt-1">
                <li>Buka <a href="https://www.google.com/maps" target="_blank" className="text-blue-600 underline">Google Maps</a></li>
                <li>Cari lokasi acara Anda</li>
                <li>Klik tombol <strong>"Share"</strong> (Bagikan)</li>
                <li>Pilih tab <strong>"Embed a map"</strong> (Sematkan peta)</li>
                <li>Copy URL dari dalam <code>src="..."</code> pada iframe</li>
                <li>Paste URL saja (tanpa &lt;iframe&gt;) di sini</li>
              </ol>
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border-2 border-emerald-300">
                <p className="text-sm text-black font-bold">✅ Contoh format yang benar:</p>
                <code className="text-xs text-gray-700 break-all">
                  https://www.google.com/maps/embed?pb=!1m18!1m12!...
                </code>
              </div>
              {formData.lokasi?.embedUrl && (
                <div className="mt-3">
                  <p className="text-sm text-black font-bold mb-2">Preview:</p>
                  <iframe
                    src={formData.lokasi.embedUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    className="w-full rounded-lg border-2 border-gray-300"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Preview Map"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <FaSave /> Simpan Lokasi
            </button>
          </div>
        )}

        {activeTab === 'flashback' && (
          <FlashbackManager
            flashbacks={flashbacks}
            onAdd={addFlashback}
            onUpdate={updateFlashback}
            onDelete={deleteFlashback}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryManager
            gallery={gallery}
            onAdd={addGallery}
            onUpdate={updateGallery}
            onDelete={deleteGallery}
          />
        )}

        {activeTab === 'guests' && (
          <GuestMessagesManager messages={messages} onDelete={deleteMessage} />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">🎨 Pengaturan Tampilan</h2>

            <div>
              <label className="block text-base font-bold text-black mb-2">Bentuk Bunga</label>
              <input
                type="text"
                value={formData.bunga?.bentuk}
                onChange={(e) => handleNestedChange('bunga', 'bentuk', e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                placeholder="🌸"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Warna Bunga (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.bunga?.warna}
                  onChange={(e) => handleNestedChange('bunga', 'warna', e.target.value)}
                  className="w-12 h-12 border-2 border-gray-400 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.bunga?.warna}
                  onChange={(e) => handleNestedChange('bunga', 'warna', e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Kecepatan Animasi (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.bunga?.kecepatan || 3}
                onChange={(e) => handleNestedChange('bunga', 'kecepatan', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-base text-black font-bold mt-1">Nilai: {formData.bunga?.kecepatan}</p>
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-2">Intensitas Bunga (5-50)</label>
              <input
                type="range"
                min="5"
                max="50"
                value={formData.bunga?.intensitas || 15}
                onChange={(e) => handleNestedChange('bunga', 'intensitas', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-base text-black font-bold mt-1">Jumlah bunga: {formData.bunga?.intensitas}</p>
            </div>

            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
            >
              <FaSave /> Simpan Tampilan
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Flashback Manager Component
function FlashbackManager({
  flashbacks,
  onAdd,
  onUpdate,
  onDelete,
}: {
  flashbacks: Flashback[];
  onAdd: (f: Omit<Flashback, 'id'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  onUpdate: (id: string, data: Partial<Flashback>) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', gambar: '', urutan: 0 });
  const { uploading, upload } = useFileUpload();

  const handleFlashbackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    const result = await upload(file, 'images/flashback');
    if (result.success && result.url) {
      setForm({ ...form, gambar: result.url });
      alert('File berhasil diupload!');
    } else {
      alert('Gagal upload: ' + result.error);
    }
  };

  const handleSubmit = async () => {
    if (editing) {
      await onUpdate(editing, form);
      setEditing(null);
    } else {
      await onAdd(form);
    }
    setForm({ judul: '', deskripsi: '', gambar: '', urutan: form.urutan + 1 });
  };

  const handleEdit = (fb: Flashback) => {
    setEditing(fb.id || null);
    setForm({
      judul: fb.judul,
      deskripsi: fb.deskripsi,
      gambar: fb.gambar || '',
      urutan: fb.urutan,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">📜 Flashback</h2>

      <div className="grid gap-4">
        {flashbacks.map((fb) => (
          <div key={fb.id} className="border-2 border-gray-400 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black">{fb.judul}</h3>
                <p className="text-base text-black font-medium">{fb.deskripsi}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(fb)} className="text-blue-600 hover:text-blue-800 font-bold">
                  <FaEdit className="text-xl" />
                </button>
                <button onClick={() => fb.id && onDelete(fb.id)} className="text-red-600 hover:text-red-800 font-bold">
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-gray-400 pt-4 mt-4 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-black mb-3">{editing ? '✏️ Edit Flashback' : '➕ Tambah Flashback'}</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Judul"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
          />
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
            rows={3}
          />
          
          {/* Gambar Upload */}
          <div>
            <label className="block text-base font-bold text-black mb-1">Gambar (Opsional)</label>
            {form.gambar && (
              <div className="mb-2">
                <img src={form.gambar} alt="Preview" className="w-full h-40 object-cover rounded-lg border-2 border-gray-400" />
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFlashbackUpload}
                  className="hidden"
                />
                <span className="flex items-center justify-center gap-2 w-full p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white">
                  <FaUpload className="text-black" />
                  <span className="text-black font-medium">Upload Gambar</span>
                </span>
              </label>
              {form.gambar && (
                <button
                  onClick={() => setForm({ ...form, gambar: '' })}
                  className="px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>

          <input
            type="number"
            placeholder="Urutan"
            value={form.urutan}
            onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
            className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-medium"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 shadow-lg"
          >
            <FaPlus /> {editing ? 'Update' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Gallery Manager Component
function GalleryManager({
  gallery,
  onAdd,
  onUpdate,
  onDelete,
}: {
  gallery: GalleryItem[];
  onAdd: (file: File, urutan: number) => Promise<{ success: boolean; id?: string; error?: string }>;
  onUpdate: (id: string, data: Partial<GalleryItem>) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string, imageUrl?: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    await onAdd(file, gallery.length);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">🖼️ Galeri Foto (Maks. 20)</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative group">
            <img src={item.imageUrl} alt="Gallery" className="w-full h-40 object-cover rounded-lg border-2 border-gray-400" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => item.id && onDelete(item.id, item.imageUrl)}
                className="p-2 bg-red-600 text-black font-bold rounded-full hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {gallery.length < 20 && (
        <label className="block">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <span className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
            <FaUpload className="text-black text-xl" />
            <span className="text-black font-bold text-base">Upload Foto</span>
          </span>
        </label>
      )}

      {gallery.length >= 20 && (
        <p className="text-base text-black font-bold bg-red-100 p-3 rounded-lg border-2 border-red-400">⚠️ Galeri sudah penuh (maksimal 20 foto)</p>
      )}
    </div>
  );
}

// Guest Messages Manager Component
function GuestMessagesManager({
  messages,
  onDelete,
}: {
  messages: GuestMessage[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const handleExportExcel = () => {
    // Prepare data with proper columns
    const data = messages.map((msg, index) => ({
      'No': index + 1,
      'Nama': msg.nama,
      'Kehadiran': msg.hadir ? 'Hadir' : 'Tidak Hadir',
      'Alamat': msg.alamat || '-',
      'Ucapan': msg.ucapan,
      'Tanggal': msg.createdAt ? new Date(msg.createdAt).toLocaleString('id-ID') : '-',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama
      { wch: 15 }, // Kehadiran
      { wch: 20 }, // Alamat
      { wch: 50 }, // Ucapan
      { wch: 25 }, // Tanggal
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ucapan Tamu');

    // Generate file name with date
    const fileName = `ucapan-tamu-${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">💬 Ucapan Tamu ({messages.length})</h2>
        {messages.length > 0 && (
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <FaFileExcel className="w-5 h-5" />
            Export Excel (.xlsx)
          </button>
        )}
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="border-2 border-gray-400 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black text-lg">{msg.nama}</h3>
                <p className="text-base text-black font-medium">
                  {msg.hadir ? '✅ Hadir' : '❌ Tidak Hadir'}
                  {msg.alamat && <span className="text-gray-700"> - {msg.alamat}</span>}
                </p>
                <p className="mt-2 text-black font-medium">{msg.ucapan}</p>
              </div>
              <button
                onClick={() => msg.id && onDelete(msg.id)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                <FaTrash className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <p className="text-center text-black font-bold py-8 bg-gray-100 rounded-lg border-2 border-gray-400">💭 Belum ada ucapan tamu</p>
      )}
    </div>
  );
}
