/**
 * Flashback Section Component
 */
'use client';

import { motion } from 'framer-motion';
import { FaHistory, FaHeart } from 'react-icons/fa';
import { Flashback as FlashbackType } from '@/types';
import FallingFlowers from '@/components/ui/FallingFlowers';
import { BungaConfig } from '@/types';

interface FlashbackSectionProps {
  flashbacks: FlashbackType[];
  bungaConfig: BungaConfig;
}

export default function FlashbackSection({ flashbacks, bungaConfig }: FlashbackSectionProps) {
  return (
    <section id="flashback" className="relative py-20 md:py-32 bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Falling Flowers Background */}
      <FallingFlowers config={bungaConfig} enabled={true} />

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
            Flashback
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-300 to-pink-400 mx-auto rounded-full" />
        </motion.div>

        {flashbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Flashback akan segera hadir</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashbacks.map((flashback, index) => (
              <motion.div
                key={flashback.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Image */}
                {flashback.gambar && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={flashback.gambar}
                      alt={flashback.judul}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className={`p-6 ${!flashback.gambar ? 'pt-8' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                      Moment {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-serif mb-3">
                    {flashback.judul}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {flashback.deskripsi}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
