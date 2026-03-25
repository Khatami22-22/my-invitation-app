/**
 * Cover Section Component
 */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowDown, FaEnvelopeOpen } from 'react-icons/fa';
import { WeddingConfig } from '@/types';
import CountdownTimer from '@/components/ui/CountdownTimer';

interface CoverSectionProps {
  config: WeddingConfig;
  onOpen: () => void;
  isOpened: boolean;
}

export default function CoverSection({ config, onOpen, isOpened }: CoverSectionProps) {
  if (isOpened) return null;

  // Target date: April 12, 2026
  const targetDate = '2026-04-12T00:00:00';

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -1000 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-50"
        style={{
          backgroundImage: config.backgroundCover ? `url(${config.backgroundCover})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: config.backgroundCover ? undefined : '#1a365d',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Content Container - scrollable */}
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6 md:space-y-8">
            {/* Salam */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="text-white/90 text-lg md:text-xl font-light text-center mb-4" dir="rtl">
                {config.salamArab || 'Assalamu\'alaikum Warahmatullahi Wabarakatuh'}
              </p>
            </motion.div>

            {/* Event Name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 font-serif">
                {config.namaAcara || 'Resepsi Pernikahan'}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
            </motion.div>

            {/* Ayat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <p className="text-white/80 text-sm md:text-base italic leading-relaxed text-center max-w-lg mx-auto">
                {config.ayatQuran || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.'}
              </p>
              <p className="text-white/60 text-xs text-center mt-3">— Ar-Rum: 21</p>
            </motion.div>

            {/* Countdown Timer */}
            <CountdownTimer targetDate={targetDate} />

            {/* Open Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={onOpen}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  <FaEnvelopeOpen className="group-hover:animate-pulse" />
                  Buka Undangan
                  <FaArrowDown className="group-hover:animate-bounce" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="mt-8"
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
