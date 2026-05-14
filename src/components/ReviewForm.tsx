/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review, BRANCHES, YEARS } from '../types';
import StarRating from './StarRating';
import { Send } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, 'id' | 'timestamp'>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    year: YEARS[0],
    branch: BRANCHES[0],
    review: '',
    rating: 0,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (formData.name.length < 2) newErrors.name = true;
    if (formData.review.length < 20) newErrors.review = true;
    if (formData.rating === 0) newErrors.rating = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate network for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      onSubmit={handleSubmit}
      className="glass-card w-full max-w-xl p-8 rounded-3xl space-y-6 z-10"
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-gold">Review form</h1>
        <p className="text-text-muted text-sm">Submit your experience into the cosmic void</p>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div className="relative group">
          <input
            type="text"
            required
            id="name"
            placeholder=" "
            className={`w-full p-4 rounded-xl pt-8 peer ${errors.name ? 'border-ember animate-shake' : ''}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label 
            htmlFor="name"
            className="absolute left-4 top-4 text-text-muted transition-all origin-left pointer-events-none peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-gold peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gold"
          >
            Your Name
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Year Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-text-muted ml-2">Year</label>
            <select
              className="w-full p-4 rounded-xl cursor-not-allowed"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-text-muted ml-2">Branch</label>
            <select
              className="w-full p-4 rounded-xl"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Review Textarea */}
        <div className="relative group">
          <textarea
            required
            id="review"
            rows={5}
            placeholder=" "
            className={`w-full p-4 rounded-xl pt-8 peer ${errors.review ? 'border-ember animate-shake' : ''}`}
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          />
          <label 
            htmlFor="review"
            className="absolute left-4 top-4 text-text-muted transition-all origin-left pointer-events-none peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-gold peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gold"
          >
            The Experience
          </label>
          <div className="flex justify-end pr-2">
            <span className={`text-[10px] ${formData.review.length < 20 ? 'text-ember' : 'text-success'}`}>
              {formData.review.length}/1000 characters
            </span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <StarRating 
            rating={formData.rating} 
            setRating={(r) => setFormData({ ...formData, rating: r })}
            error={errors.rating}
          />
        </div>
      </div>

      <motion.button
        id="submit-btn"
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 rounded-xl gold-gradient-bg text-bg-deep font-bold text-lg flex items-center justify-center space-x-2 relative shadow-[0_0_20px_rgba(245,197,24,0.3)]"
      >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div
              key="loader"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-6 height-6 border-2 border-bg-deep border-t-transparent rounded-full"
            />
          ) : (
            <motion.div key="text" className="flex items-center space-x-2">
              <span>Submit Memory</span>
              <Send size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
};

export default ReviewForm;
