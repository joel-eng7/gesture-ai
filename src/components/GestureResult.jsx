import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand,
  ThumbsUp,
  HelpCircle,
  Scan,
  Volume2,
  VolumeX,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function GestureResult({
  currentGesture,
  handCount,
  fps,
  latency,
  isMuted,
  setIsMuted
}) {
  const {
    id,
    name,
    description,
    confidence = 0,
    fingerStates = {},
    metrics,
    emoji
  } = currentGesture || {};

  const isNoHand = id === 'NO_HAND';
  const isUnknown = id === 'UNKNOWN';
  const isRecognized = !isNoHand && !isUnknown;

  // Icon selector
  const renderGestureIcon = () => {
    switch (id) {
      case 'OPEN_HAND':
        return <Hand className="w-16 h-16 text-gesture-primary" />;
      case 'FIST':
        // Custom SVG for closed fist
        return (
          <div className="w-16 h-16 flex items-center justify-center text-4xl">
            ✊
          </div>
        );
      case 'THUMBS_UP':
        return <ThumbsUp className="w-16 h-16 text-gesture-electric" />;
      case 'VICTORY':
        return (
          <div className="w-16 h-16 flex items-center justify-center text-4xl">
            ✌️
          </div>
        );
      case 'UNKNOWN':
        return <HelpCircle className="w-16 h-16 text-slate-400 animate-spin" />;
      default:
        return <Scan className="w-16 h-16 text-slate-400 animate-pulse" />;
    }
  };

  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-glass flex flex-col gap-6 relative overflow-hidden">
      {/* Background ambient glow matching recognized gesture */}
      {isRecognized && (
        <div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-20 transition-all duration-500"
          style={{ backgroundColor: currentGesture.color || '#1677FF' }}
        />
      )}

      {/* Header with Title and Mute Sound Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gesture-electric">
            Neural Classifier
          </span>
          <h3 className="text-xl font-extrabold text-gesture-navy dark:text-white">
            AI Recognition
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const nextMuted = soundManager.toggleMute();
              setIsMuted(nextMuted);
            }}
            title={isMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
            className="p-2 rounded-xl border border-gesture-electric/20 hover:bg-gesture-light dark:hover:bg-gesture-darkCard text-gesture-navy dark:text-gesture-light transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gesture-primary dark:text-gesture-cyan" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Animated Gesture Display Box */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-b from-white/90 to-gesture-light/40 dark:from-gesture-darkCard/90 dark:to-gesture-darkBg/60 border border-gesture-electric/25 shadow-card-soft text-center flex flex-col items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={id || 'no_hand'}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Gesture Icon badge with glow */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border border-gesture-electric/30 shadow-glass flex items-center justify-center">
                {renderGestureIcon()}
              </div>

              {isRecognized && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gesture-primary text-white flex items-center justify-center shadow-glow-blue">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Gesture Name */}
            <h2 className="text-2xl font-black text-gesture-navy dark:text-white tracking-tight">
              {name || 'No Hand Detected'}
            </h2>

            {/* Gesture Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              {description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Recognition Confidence Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gesture-electric" />
            <span>Geometric Confidence</span>
          </span>
          <span className="font-mono text-gesture-primary dark:text-gesture-cyan font-bold text-sm">
            {isRecognized ? `${confidencePercent}%` : '--'}
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-200/60 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gesture-primary via-gesture-electric to-gesture-cyan"
            initial={{ width: 0 }}
            animate={{ width: isRecognized ? `${confidencePercent}%` : '0%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Finger Kinematic Telemetry */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
          Finger States Telemetry
        </span>

        <div className="grid grid-cols-5 gap-2">
          {[
            { key: 'thumb', label: 'Thumb', state: fingerStates.thumb },
            { key: 'index', label: 'Index', state: fingerStates.index },
            { key: 'middle', label: 'Middle', state: fingerStates.middle },
            { key: 'ring', label: 'Ring', state: fingerStates.ring },
            { key: 'pinky', label: 'Pinky', state: fingerStates.pinky },
          ].map(f => (
            <div
              key={f.key}
              className={`rounded-xl p-2 text-center border transition-all duration-200 ${
                f.state
                  ? 'border-gesture-primary bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-semibold">{f.label}</div>
              <div className="text-[9px] font-mono mt-0.5 font-bold">
                {f.state ? 'OPEN' : 'FOLD'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Pipeline Telemetry Footer */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 block">Latency</span>
          <span className="font-mono font-bold text-gesture-navy dark:text-slate-200">
            {latency > 0 ? `${latency} ms` : '--'}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 block">Hands</span>
          <span className="font-mono font-bold text-gesture-navy dark:text-slate-200">
            {handCount}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 block">Status</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {isRecognized ? 'Active' : 'Scanning'}
          </span>
        </div>
      </div>
    </div>
  );
}
