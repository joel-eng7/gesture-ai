import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ChevronRight, Sparkles, Hand, ThumbsUp } from 'lucide-react';

export default function GestureCard({
  gestureId,
  name,
  description,
  emoji,
  color,
  accent,
  fingerBreakdown,
  geometricRules,
  isActive = false,
  onSelect
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-3xl p-6 glass-card border transition-all duration-300 flex flex-col justify-between ${
        isActive
          ? 'border-gesture-primary shadow-glow-blue ring-2 ring-gesture-primary/30'
          : 'border-gesture-electric/15 hover:border-gesture-electric/40 shadow-card-soft'
      }`}
    >
      {/* Top Accent Gradient Bar */}
      <div
        className="absolute top-0 left-8 right-8 h-1 rounded-b-full opacity-80"
        style={{ background: `linear-gradient(90deg, ${color}, ${accent})` }}
      />

      <div>
        {/* Header: Visual Badge & State */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-white to-gesture-light dark:from-slate-800 dark:to-slate-900 border border-gesture-electric/25 flex items-center justify-center text-3xl shadow-sm">
            {emoji}
          </div>

          {isActive && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gesture-primary text-white shadow-glow-blue flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>DETECTED NOW</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-extrabold text-gesture-navy dark:text-white tracking-tight mb-1.5">
          {name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {description}
        </p>

        {/* Finger Configuration Tags */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Required Finger Configuration
          </span>
          <div className="flex flex-wrap gap-1.5">
            {fingerBreakdown.map((item, idx) => (
              <span
                key={idx}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1 ${
                  item.extended
                    ? 'border-gesture-primary/30 bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500'
                }`}
              >
                <Check className={`w-3 h-3 ${item.extended ? 'text-gesture-primary dark:text-gesture-cyan' : 'text-slate-400'}`} />
                <span>{item.finger}: {item.state}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Geometric Breakdown */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mb-4 text-xs space-y-1.5 text-slate-600 dark:text-slate-300"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gesture-electric block">
              Geometric Classifier Constraints:
            </span>
            {geometricRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                <span className="text-gesture-cyan font-bold">•</span>
                <span>{rule}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-gesture-primary dark:text-gesture-cyan hover:underline flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Specs' : 'Kinematic Specs'}</span>
        </button>

        {onSelect && (
          <button
            onClick={() => onSelect(gestureId)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gesture-light dark:bg-gesture-darkCard text-gesture-navy dark:text-gesture-light hover:bg-gesture-primary hover:text-white transition-all flex items-center gap-1"
          >
            <span>Simulate 3D</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
