/**
 * Countdown Timer Component
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string; // ISO date string (e.g., "2026-04-12T00:00:00")
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <p className="text-white/90 text-lg md:text-xl font-light">
          🎉 Acara Sedang Berlangsung! 🎉
        </p>
      </motion.div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari', plural: 'Hari' },
    { value: timeLeft.hours, label: 'Jam', plural: 'Jam' },
    { value: timeLeft.minutes, label: 'Menit', plural: 'Menit' },
    { value: timeLeft.seconds, label: 'Detik', plural: 'Detik' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mb-6 w-full"
    >
      <p className="text-white/80 text-xs md:text-sm mb-3 italic text-center">
        Menuju Hari Bahagia
      </p>

      <div className="grid grid-cols-4 gap-1 md:gap-3 max-w-sm mx-auto">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-1 md:p-3 border border-white/20 w-full"
          >
            <div className="text-lg md:text-3xl font-bold text-white mb-0 md:mb-1 text-center">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-xs text-white/70 text-center">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-3 text-center"
      >
        <p className="text-white/60 text-[10px] md:text-xs">
          📅 12 April 2026
        </p>
      </motion.div>
    </motion.div>
  );
}
