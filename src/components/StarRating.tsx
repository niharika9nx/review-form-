/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  error?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, error }) => {
  const [hover, setHover] = useState(0);

  const labels = ["Terrible", "Poor", "Okay", "Good", "Amazing!"];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none relative"
          >
            <Star
              size={40}
              className={`transition-colors duration-300 ${
                (hover || rating) >= star 
                  ? 'fill-gold text-gold filter drop-shadow-[0_0_8px_rgba(245,197,24,0.6)]' 
                  : 'text-text-muted opacity-50'
              }`}
            />
            {rating === star && (
              <motion.div
                layoutId="sparkle"
                className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={hover || rating}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-sm font-medium ${error && !rating ? 'text-ember' : 'text-gold'}`}
        >
          {hover ? labels[hover - 1] : rating ? labels[rating - 1] : "Tap to rate"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default StarRating;
