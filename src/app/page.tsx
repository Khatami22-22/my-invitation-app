/**
 * Main Invitation Page
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMusic, FaMusic as FaMusicOff } from 'react-icons/fa';
import CoverSection from '@/components/sections/CoverSection';
import CoupleSection from '@/components/sections/CoupleSection';
import LocationSection from '@/components/sections/LocationSection';
import FlashbackSection from '@/components/sections/FlashbackSection';
import GallerySection from '@/components/sections/GallerySection';
import GuestBookSection from '@/components/sections/GuestBookSection';
import { useWeddingConfig, useFlashbacks, useGallery, useGuestMessages } from '@/lib/firebase/hooks';
import { WeddingConfig, Flashback, GalleryItem, GuestMessage } from '@/types';

// Default config for initial load
const defaultConfig: WeddingConfig = {
  backgroundCover: '',
  salamArab: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh',
  namaAcara: 'Resepsi Pernikahan',
  ayatQuran: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.',
  musicUrl: '',
  pengantinPria: { foto: '', nama: '', namaOrtu: '' },
  pengantinWanita: { foto: '', nama: '', namaOrtu: '' },
  lokasi: { nama: '', waktu: '', linkMap: '' },
  bunga: { bentuk: '🌸', warna: '#ffb7c5', kecepatan: 3, intensitas: 15 },
};

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { config, loading: configLoading } = useWeddingConfig();
  const { flashbacks, loading: flashbackLoading } = useFlashbacks();
  const { gallery, loading: galleryLoading } = useGallery();
  const { messages, addMessage, loading: messagesLoading } = useGuestMessages();

  // Initialize audio
  useEffect(() => {
    if (config?.musicUrl) {
      audioRef.current = new Audio(config.musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [config?.musicUrl]);

  const handleOpen = async () => {
    setIsOpened(true);
    
    // Try to play music after user interaction
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay prevented:', error);
      }
    }

    // Scroll to couple section after animation
    setTimeout(() => {
      document.getElementById('couple')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Play failed:', error);
      }
    }
  };

  const handleSubmitMessage = async (data: { nama: string; hadir: boolean; alamat: string; ucapan: string }) => {
    return await addMessage(data);
  };

  const isLoading = configLoading || flashbackLoading || galleryLoading || messagesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  const currentConfig = config || defaultConfig;

  return (
    <main className="relative">
      {/* Cover Section */}
      <CoverSection
        config={currentConfig}
        onOpen={handleOpen}
        isOpened={isOpened}
      />

      {/* Music Control (shown after opening) */}
      {isOpened && config?.musicUrl && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white animate-pulse'
              : 'bg-white text-gray-600'
          }`}
        >
          {isPlaying ? <FaMusic className="text-xl" /> : <FaMusicOff className="text-xl" />}
        </motion.button>
      )}

      {/* Main Content */}
      {isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Couple Section */}
          <CoupleSection config={currentConfig} />

          {/* Location Section */}
          <LocationSection config={currentConfig} />

          {/* Flashback Section */}
          <FlashbackSection flashbacks={flashbacks} bungaConfig={currentConfig.bunga} />

          {/* Gallery Section */}
          <GallerySection gallery={gallery} bungaConfig={currentConfig.bunga} />

          {/* Guest Book Section */}
          <GuestBookSection
            messages={messages}
            onSubmit={handleSubmitMessage}
            bungaConfig={currentConfig.bunga}
          />

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-serif mb-4">
                  Terima Kasih
                </h3>
                <p className="text-gray-300 mb-6">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto rounded-full mb-6" />
                <p className="text-sm text-gray-400">
                  {currentConfig.pengantinPria?.nama} & {currentConfig.pengantinWanita?.nama}
                </p>
              </motion.div>
            </div>
          </footer>
        </motion.div>
      )}
    </main>
  );
}
