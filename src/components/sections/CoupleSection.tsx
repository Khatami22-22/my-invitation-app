/**
 * Couple Section Component
 */
'use client';

import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { WeddingConfig } from '@/types';
import FallingFlowers from '@/components/ui/FallingFlowers';

interface CoupleSectionProps {
  config: WeddingConfig;
}

export default function CoupleSection({ config }: CoupleSectionProps) {
  const pria = config.pengantinPria;
  const wanita = config.pengantinWanita;

  return (
    <section id="couple" className="relative py-20 md:py-32 bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 overflow-hidden">
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
            Mempelai
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-rose-300 to-pink-400 mx-auto rounded-full" />
        </motion.div>

        {/* Couple Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Pengantin Pria */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-auto flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className="w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                {pria?.foto ? (
                  <img
                    src={pria.foto}
                    alt={pria.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                    <span className="text-6xl text-white">🤵</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg md:text-xl">👦</span>
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto">
              <h3 className="text-xl md:text-3xl font-bold text-gray-800 font-serif mb-2 break-words">
                {pria?.nama || 'Pengantin Pria'}
              </h3>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Putra dari
              </p>
              <p className="text-gray-700 font-medium text-center text-sm md:text-base break-words">
                {pria?.namaOrtu || 'Bapak & Ibu'}
              </p>
            </div>
          </motion.div>

          {/* Heart Separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <FaHeart className="w-10 h-10 md:w-16 md:h-16 text-rose-500 animate-pulse" />
              <div className="absolute inset-0 w-10 h-10 md:w-16 md:h-16 bg-rose-300 rounded-full blur-xl opacity-50 animate-pulse" />
            </div>
          </motion.div>

          {/* Pengantin Wanita */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-auto flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className="w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                {wanita?.foto ? (
                  <img
                    src={wanita.foto}
                    alt={wanita.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center">
                    <span className="text-6xl text-white">👰</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg md:text-xl">👧</span>
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto">
              <h3 className="text-xl md:text-3xl font-bold text-gray-800 font-serif mb-2 break-words">
                {wanita?.nama || 'Pengantin Wanita'}
              </h3>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Putri dari
              </p>
              <p className="text-gray-700 font-medium text-center text-sm md:text-base break-words">
                {wanita?.namaOrtu || 'Bapak & Ibu'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 italic">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
          </p>
          <p className="text-gray-500 text-sm mt-2">— QS. Ar-Rum: 21</p>
        </motion.div>
      </div>
    </section>
  );
}
