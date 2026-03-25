/**
 * Falling Flowers Animation Component
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BungaConfig } from '@/types';

interface Flower {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export default function FallingFlowers({ config, enabled = true }: { config: BungaConfig; enabled?: boolean }) {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  const generateFlowers = useCallback(() => {
    if (!enabled) return;

    const newFlowers: Flower[] = [];
    const count = config.intensitas || 15;

    for (let i = 0; i < count; i++) {
      newFlowers.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 10 + Math.random() * 15,
        rotation: Math.random() * 360,
      });
    }
    setFlowers(newFlowers);
  }, [config.intensitas, config.kecepatan, config.warna, config.bentuk, enabled]);

  useEffect(() => {
    generateFlowers();
  }, [generateFlowers]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flowers.map((flower, idx) => (
        <motion.div
          key={`flower-${flower.id}-${idx}`}
          initial={{ y: -50, x: `${flower.left}%`, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            rotate: flower.rotation + 360,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: flower.duration * (11 - (config.kecepatan || 3)) / 3,
            delay: flower.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${flower.left}%`,
            fontSize: `${flower.size}px`,
            color: config.warna,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          className="opacity-60"
        >
          {config.bentuk || '🌸'}
        </motion.div>
      ))}
    </div>
  );
}
