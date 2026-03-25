/**
 * Gallery Section Component with Lightbox
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImages, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GalleryItem } from '@/types';
import FallingFlowers from '@/components/ui/FallingFlowers';
import { BungaConfig } from '@/types';

interface GallerySectionProps {
  gallery: GalleryItem[];
  bungaConfig: BungaConfig;
}

export default function GallerySection({ gallery, bungaConfig }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === null ? null : (prev - 1 + gallery.length) % gallery.length));
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === null ? null : (prev + 1) % gallery.length));
    }
  };

  return (
    <section id="gallery" className="relative py-20 md:py-32 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
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
            Galeri Foto
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-300 to-orange-400 mx-auto rounded-full" />
        </motion.div>

        {gallery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Galeri foto akan segera hadir</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="relative overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-all flex flex-col"
              >
                <div className="w-full flex-1 min-h-[150px]">
                  <img
                    src={item.imageUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {gallery.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-gray-500 mt-8"
          >
            Klik pada foto untuk memperbesar
          </motion.p>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && gallery[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <FaTimes className="text-3xl" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <FaChevronLeft className="text-3xl" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <FaChevronRight className="text-3xl" />
            </button>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={gallery[selectedImage].imageUrl}
              alt={`Gallery ${selectedImage + 1}`}
              className="max-w-full max-h-full w-auto h-auto max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
