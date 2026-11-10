import React from 'react';
import {
  Gauge,
  Timer,
  CheckCircle,
  Activity,
  Layers,
  Cpu,
  BarChart3
} from 'lucide-react';
import { GESTURE_TYPES, GESTURE_INFO } from '../utils/gestureClassifier';

export default function AnalyticsPanel({
  totalDetections = 0,
  currentGesture = null,
  handCount = 0,
  cameraStatus = 'idle',
  fps = 0,
  latency = 0,
  sessionDuration = 0,
  gestureCounts = {},
  isDemoMode = false
}) {
  // Format seconds to mm:ss or hh:mm:ss
  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m ${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const gestureList = [
    { type: GESTURE_TYPES.OPEN_HAND, info: GESTURE_INFO[GESTURE_TYPES.OPEN_HAND] },
    { type: GESTURE_TYPES.FIST, info: GESTURE_INFO[GESTURE_TYPES.FIST] },
    { type: GESTURE_TYPES.THUMBS_UP, info: GESTURE_INFO[GESTURE_TYPES.THUMBS_UP] },
    { type: GESTURE_TYPES.VICTORY, info: GESTURE_INFO[GESTURE_TYPES.VICTORY] },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-glass flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gesture-electric" />
          <h3 className="text-lg font-bold text-gesture-navy dark:text-white">
            Performance & Session Analytics
          </h3>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan">
          REAL-TIME TELEMETRY
        </span>
      </div>

      {/* Primary 6 Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total Confirmed Detections */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Total Detections</span>
            <CheckCircle className="w-4 h-4 text-gesture-primary" />
          </div>
          <div className="text-2xl font-black text-gesture-navy dark:text-white font-mono">
            {totalDetections}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Confirmed events</span>
        </div>

        {/* Metric 2: Current Gesture */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Current Gesture</span>
            <span className="text-sm">{currentGesture?.emoji || '—'}</span>
          </div>
          <div className="text-sm font-black text-gesture-navy dark:text-white truncate">
            {currentGesture?.name || 'No Hand'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {currentGesture?.confidence ? `${Math.round(currentGesture.confidence * 100)}% Match` : 'Awaiting'}
          </span>
        </div>

        {/* Metric 3: Number of Detected Hands */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Active Hands</span>
            <Layers className="w-4 h-4 text-gesture-electric" />
          </div>
          <div className="text-2xl font-black text-gesture-navy dark:text-white font-mono">
            {handCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Max 2 hands tracked</span>
        </div>

        {/* Metric 4: Camera Status */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Source Status</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-bold text-gesture-navy dark:text-white capitalize">
            {isDemoMode ? 'Demo Simulator' : cameraStatus}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {cameraStatus === 'active' || isDemoMode ? 'Streaming' : 'Offline'}
          </span>
        </div>

        {/* Metric 5: Processing FPS */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Framerate</span>
            <Gauge className="w-4 h-4 text-gesture-cyan" />
          </div>
          <div className="text-2xl font-black text-gesture-navy dark:text-white font-mono">
            {fps} <span className="text-xs text-slate-400 font-sans">FPS</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {latency > 0 ? `${latency}ms latency` : 'Real-time'}
          </span>
        </div>

        {/* Metric 6: Session Duration */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Session Time</span>
            <Timer className="w-4 h-4 text-gesture-primary" />
          </div>
          <div className="text-xl font-black text-gesture-navy dark:text-white font-mono">
            {formatDuration(sessionDuration)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Active compute</span>
        </div>
      </div>

      {/* Gesture Frequency Breakdown */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Session Gesture Distribution
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gestureList.map(({ type, info }) => {
            const count = gestureCounts[type] || 0;
            const percentage = totalDetections > 0 ? Math.round((count / totalDetections) * 100) : 0;

            return (
              <div
                key={type}
                className="p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gesture-navy dark:text-white">
                    <span>{info.emoji}</span>
                    <span>{info.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gesture-primary dark:text-gesture-cyan">
                    {count}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gesture-primary to-gesture-cyan transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Share</span>
                  <span>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
