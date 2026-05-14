/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  LogOut, 
  Download, 
  Trash2, 
  Star, 
  Search,
  Filter,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Review, BRANCHES, YEARS } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AdminDashboardProps {
  reviews: Review[];
  onDelete: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reviews, onDelete, onLogout }) => {
  const [view, setView] = useState<'dashboard' | 'reviews'>('dashboard');
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [sortOrder, setSortOrder] = useState<'latest' | 'highest' | 'lowest'>('latest');

  // Stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length
  }));

  const branchCounts = BRANCHES.map(b => ({
    label: b,
    count: reviews.filter(r => r.branch === b).length
  }));

  const yearCounts = YEARS.map(y => ({
    label: y,
    count: reviews.filter(r => r.year === y).length
  }));

  const downloadPDF = () => {
    const doc = new jsPDF() as any;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(245, 197, 24); // Gold
    doc.text('Cosmic Event Reviews', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    doc.text(`Total Reviews: ${totalReviews} | Avg Rating: ${avgRating} stars`, 105, 37, { align: 'center' });

    const tableData = reviews.map((r, i) => [
      i + 1,
      r.name,
      r.year,
      r.branch,
      '★'.repeat(r.rating),
      r.review,
      new Date(r.timestamp).toLocaleDateString()
    ]);

    (doc as any).autoTable({
      head: [['#', 'Name', 'Year', 'Branch', 'Rating', 'Review', 'Date']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [245, 197, 24], textColor: [3, 4, 10] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: (data: any) => {
        doc.setFontSize(8);
        doc.text('Confidential — Admin Use Only', data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('Cosmic_Event_Reviews.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-bg-deep z-[200] flex flex-col md:flex-row"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-bg-mid border-r border-gold/10 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-bg-deep font-display font-bold text-xl">
            C
          </div>
          <span className="font-display font-bold text-lg text-gold">Cosmic Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
              view === 'dashboard' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setView('reviews')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
              view === 'reviews' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <TableIcon size={20} />
            <span className="font-medium">All Reviews</span>
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center space-x-3 p-3 text-ember hover:bg-ember/10 rounded-xl transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-bg-deep p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              {view === 'dashboard' ? 'Analytics Overview' : 'Review Management'}
            </h1>
            <p className="text-text-muted text-sm mt-1">
              {view === 'dashboard' ? 'Real-time feedback insights' : `Managing ${totalReviews} total memories`}
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-6 py-3 bg-gold text-bg-deep rounded-xl font-bold shadow-lg shadow-gold/20 hover:scale-105 transition-transform"
          >
            <Download size={20} />
            <span>Export PDF</span>
          </button>
        </header>

        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dash"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Reviews" value={totalReviews} suffix="" delay={0.1} />
                <StatCard label="Average Rating" value={avgRating} suffix="⭐" delay={0.2} />
                <StatCard label="Growth" value="+12%" suffix="" delay={0.3} isSmall />
                <StatCard label="Last Week" value={Math.floor(totalReviews * 0.4)} suffix="new" delay={0.4} isSmall />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Star size={18} className="text-gold" />
                    Rating Distribution
                  </h3>
                  <div className="space-y-4">
                    {ratingCounts.map((rc, idx) => (
                      <div key={rc.stars} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-mono text-text-muted">{rc.stars} ★</span>
                        <div className="flex-1 bg-white/5 h-3 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${totalReviews ? (rc.count / totalReviews) * 100 : 0}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                            className={`h-full ${rc.stars >= 4 ? 'bg-success' : rc.stars >= 2 ? 'bg-gold' : 'bg-ember'}`}
                          />
                        </div>
                        <span className="w-8 text-xs font-mono text-right">{rc.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                  <h3 className="text-lg font-bold mb-6 self-start">Branch Share</h3>
                  <DonutChart data={branchCounts} />
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-6">Year Distribution</h3>
                  <BarChart data={yearCounts} />
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 4).map((r, i) => (
                      <div key={r.id} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold shrink-0">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{r.name}</p>
                          <p className="text-xs text-text-muted line-clamp-1 italic">"{r.review}"</p>
                          <div className="flex items-center gap-2 mt-1">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} size={10} className="fill-gold text-gold" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-text-muted text-center py-10">Waiting for first light...</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search memories..."
                    className="w-full p-3 pl-10 rounded-xl bg-white/5"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-text-muted" size={18} />
                </div>
                <select 
                  className="p-3 rounded-xl bg-white/5 min-w-[120px]"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select 
                  className="p-3 rounded-xl bg-white/5 min-w-[120px]"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
                  <option value="latest">Latest</option>
                  <option value="highest">Top Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              {/* Review List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews
                  .filter(r => 
                    (filterBranch === 'All' || r.branch === filterBranch) &&
                    (r.name.toLowerCase().includes(search.toLowerCase()) || r.review.toLowerCase().includes(search.toLowerCase()))
                  )
                  .sort((a, b) => {
                    if (sortOrder === 'highest') return b.rating - a.rating;
                    if (sortOrder === 'lowest') return a.rating - b.rating;
                    return b.timestamp - a.timestamp;
                  })
                  .map(r => (
                    <ReviewListItem key={r.id} review={r} onDelete={() => onDelete(r.id)} />
                  ))
                }
                {reviews.length === 0 && (
                  <div className="col-span-full py-20 text-center text-text-muted glass-card rounded-2xl">
                    No memories found in the archive.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

// Sub-components for Dashboard

const StatCard = ({ label, value, suffix, delay, isSmall = false }: any) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Number(start.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-card p-6 rounded-2xl border-l-4 ${isSmall ? 'border-ember' : 'border-gold'}`}
    >
      <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-black text-text-primary">
          {displayValue}{suffix}
        </span>
      </div>
    </motion.div>
  );
};

const DonutChart = ({ data }: { data: { label: string; count: number }[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = ['#f5c518', '#ff6b35', '#3dffa0', '#22d3ee', '#818cf8', '#f472b6', '#a78bfa'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = data.reduce((acc, d) => acc + d.count, 0) || 1;
    let startAngle = -Math.PI / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 70;
    const innerRadius = 45;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((d, i) => {
      const sliceAngle = (d.count / total) * (Math.PI * 2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      
      startAngle += sliceAngle;
    });

    // Label
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#f0eee8';
    ctx.textAlign = 'center';
    ctx.fillText('Distribution', centerX, centerY + 5);
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width="200" height="200" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
        {data.filter(d => d.count > 0).map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-[10px]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-text-muted">{d.label}</span>
            <span className="text-text-primary font-bold">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data }: { data: { label: string; count: number }[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const max = Math.max(...data.map(d => d.count), 1);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;
    const barWidth = (width - padding * 2) / data.length - 10;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    data.forEach((d, i) => {
      const barHeight = (d.count / max) * chartHeight;
      const x = padding + i * (barWidth + 10);
      const y = height - padding - barHeight;

      // Draw Bar
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, '#f5c518');
      gradient.addColorStop(1, 'rgba(245, 197, 24, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#9090a0';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label.split(' ')[0], x + barWidth / 2, height - 10);
      
      // Value
      ctx.fillStyle = '#f0eee8';
      ctx.fillText(d.count.toString(), x + barWidth / 2, y - 5);
    });
  }, [data]);

  return <canvas ref={canvasRef} width="350" height="200" className="w-full h-full" />;
};

const ReviewListItem: React.FC<{ review: Review; onDelete: () => void }> = ({ review, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout className="glass-card p-5 rounded-2xl flex flex-col gap-3 group relative border-white/5 hover:border-gold/30 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient-bg text-bg-deep flex items-center justify-center font-bold font-display">
            {review.name[0]}
          </div>
          <div>
            <h4 className="font-bold text-text-primary">{review.name}</h4>
            <div className="flex gap-2 text-[10px] text-text-muted uppercase tracking-tighter">
              <span>{review.year}</span>
              <span>•</span>
              <span>{review.branch}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? 'fill-gold text-gold' : 'text-white/10'} />
            ))}
          </div>
          <span className="text-[10px] text-text-muted">
            {new Date(review.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className={`text-sm text-text-muted italic leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
        "{review.review}"
      </p>

      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-bold text-gold flex items-center gap-1 hover:underline"
        >
          {expanded ? 'Show Less' : 'Read More'}
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <button
          onClick={() => {
            if (confirm('Erase this memory from the stars?')) onDelete();
          }}
          className="p-2 text-ember hover:bg-ember/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
