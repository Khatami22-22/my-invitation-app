/**
 * Location Section Component
 */
'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaLocationArrow } from 'react-icons/fa';
import { WeddingConfig } from '@/types';
import FallingFlowers from '@/components/ui/FallingFlowers';

interface LocationSectionProps {
  config: WeddingConfig;
}

export default function LocationSection({ config }: LocationSectionProps) {
  const lokasi = config.lokasi;

  // Extract embed URL from Google Maps link
  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    // If already an embed URL
    if (url.includes('/maps/embed/v1/') || url.includes('/embed?')) return url;

    // Handle Google Maps share URLs (e.g., https://maps.app.goo.gl/xxx)
    if (url.includes('maps.app.goo.gl')) {
      // Short URLs need to be converted by user - return placeholder
      console.warn('Short URL detected. Please use the full Google Maps embed URL from "Share → Embed a map"');
      return '';
    }

    // Handle Google Maps place URLs (e.g., https://www.google.com/maps/place/...)
    const placeMatch = url.match(/\/maps\/place\/.*?@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (placeMatch) {
      // Extract place name from URL
      const placeName = url.match(/\/maps\/place\/([^/]+)/)?.[1];
      const decodedPlace = placeName ? decodeURIComponent(placeName).replace(/\+/g, ' ') : '';
      
      if (decodedPlace) {
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(decodedPlace)}`;
      }
      return `https://maps.google.com/maps?q=${placeMatch[1]},${placeMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // Handle URLs with coordinates (e.g., https://www.google.com/maps?q=xxx)
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return `https://maps.google.com/maps?q=${qMatch[1]},${qMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // Handle short URLs with @coordinates
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    return '';
  };

  const embedUrl = lokasi?.embedUrl || getEmbedUrl(lokasi?.linkMap || '');
  const showMapFallback = !embedUrl && lokasi?.linkMap;

  return (
    <section id="location" className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
      {/* Falling Flowers Background */}
      <FallingFlowers config={config.bunga} enabled={true} />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 font-serif mb-4">
            Lokasi & Waktu
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-300 to-indigo-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Google Maps"
                allow="geolocation"
              />
            ) : showMapFallback ? (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-6 text-center">
                <FaMapMarkerAlt className="text-6xl text-blue-500 mb-4" />
                <p className="text-black font-bold mb-4">Map tidak dapat ditampilkan</p>
                <a
                  href={lokasi.linkMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <FaLocationArrow />
                  Buka di Google Maps
                </a>
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <FaMapMarkerAlt className="text-6xl text-blue-400" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Location Name */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Lokasi Acara</h3>
                  <p className="text-gray-600">{lokasi?.nama || 'Nama Lokasi'}</p>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-indigo-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Waktu Acara</h3>
                  <p className="text-gray-600">{lokasi?.waktu || 'Sabtu, 1 Januari 2025 - 10:00 WIB'}</p>
                </div>
              </div>
            </div>

            {/* Navigate Button */}
            {lokasi?.linkMap && (
              <a
                href={lokasi.linkMap}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaLocationArrow />
                Menuju Lokasi
              </a>
            )}

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-2">📍 Petunjuk</h4>
              <p className="text-sm text-gray-600">
                Klik tombol &quot;Menuju Lokasi&quot; untuk membuka aplikasi peta dan mendapatkan petunjuk arah ke lokasi acara.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
