/**
 * Guest Book Section Component
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaPaperPlane, FaUser, FaCommentDots, FaMapMarker } from 'react-icons/fa';
import { GuestMessage } from '@/types';
import FallingFlowers from '@/components/ui/FallingFlowers';
import { BungaConfig } from '@/types';

interface GuestBookSectionProps {
  messages: GuestMessage[];
  onSubmit: (data: { nama: string; hadir: boolean; alamat: string; ucapan: string }) => Promise<{ success: boolean; error?: string }>;
  bungaConfig: BungaConfig;
}

export default function GuestBookSection({ messages, onSubmit, bungaConfig }: GuestBookSectionProps) {
  const [form, setForm] = useState({
    nama: '',
    hadir: true,
    alamat: '',
    ucapan: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await onSubmit(form);

    if (result.success) {
      setSubmitted(true);
      setForm({ nama: '', hadir: true, alamat: '', ucapan: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert('Gagal mengirim ucapan: ' + result.error);
    }

    setSubmitting(false);
  };

  const formatDate = (date?: Date | string | number) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <section id="guestbook" className="relative py-20 md:py-32 bg-gradient-to-b from-green-50 via-teal-50 to-green-100 overflow-hidden">
      {/* Falling Flowers Background */}
      <FallingFlowers config={bungaConfig} enabled={true} />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black font-serif mb-4">
            Ucapan & Doa
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-green-300 to-teal-400 mx-auto rounded-full" />
          <p className="mt-4 text-black">Kirimkan ucapan dan doa restu untuk kedua mempelai</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-black mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="nama"
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Kehadiran <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hadir"
                    checked={form.hadir === true}
                    onChange={() => setForm({ ...form, hadir: true })}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-black">✅ Hadir</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hadir"
                    checked={form.hadir === false}
                    onChange={() => setForm({ ...form, hadir: false })}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-black">❌ Tidak Hadir</span>
                </label>
              </div>
            </div>

            {/* Address (Optional) */}
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-black mb-2">
                Alamat <span className="text-gray-400">(Opsional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarker className="text-gray-400" />
                </div>
                <input
                  id="alamat"
                  type="text"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Kota, Provinsi"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="ucapan" className="block text-sm font-medium text-black mb-2">
                Ucapan & Doa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaCommentDots className="text-gray-400" />
                </div>
                <textarea
                  id="ucapan"
                  required
                  value={form.ucapan}
                  onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500 resize-none"
                  placeholder="Tuliskan ucapan dan doa Anda..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || submitted}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                submitted
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengirim...
                </>
              ) : submitted ? (
                <>
                  <FaHeart className="animate-pulse" />
                  Terima Kasih! Ucapan terkirim
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Kirim Ucapan
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
            <FaCommentDots className="text-green-500" />
            Daftar Ucapan ({messages.length})
          </h3>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada ucapan. Jadilah yang pertama!</p>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-black">{msg.nama}</h4>
                      <p className="text-sm text-black">
                        {msg.hadir ? (
                          <span className="text-green-600">✅ Akan Hadir</span>
                        ) : (
                          <span className="text-red-600">❌ Tidak Hadir</span>
                        )}
                        {msg.alamat && <span className="ml-2 text-black">• {msg.alamat}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      {msg.createdAt && (
                        <span className="text-xs text-black font-medium block">{formatDate(msg.createdAt)}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-black leading-relaxed">{msg.ucapan}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
