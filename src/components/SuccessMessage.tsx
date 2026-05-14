/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

const SuccessMessage: React.FC = () => {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f5c518', '#ff6b35']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f5c518', '#ff6b35']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 z-10 p-8 glass-card rounded-3xl"
    >
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles size={80} className="text-gold" />
        </motion.div>
      </div>
      <h2 className="font-display text-4xl font-bold text-text-primary">
        Memory Engraved!
      </h2>
      <p className="text-xl text-gold font-light italic">
        "Your memory has been written into the stars ✨"
      </p>
      <motion.button
        onClick={() => window.location.reload()}
        className="px-6 py-2 border border-gold/30 rounded-full text-gold text-sm hover:bg-gold/10 transition-colors"
      >
        Submit Another
      </motion.button>
    </motion.div>
  );
};

export default SuccessMessage;
