import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Layers,
  HelpCircle,
  Volume2,
  VolumeX,
  Keyboard,
  Info
} from 'lucide-react';
import CameraFeed from '../components/CameraFeed';
import GestureResult from '../components/GestureResult';
import AnalyticsPanel from '../components/AnalyticsPanel';
import GestureHistory from '../components/GestureHistory';
import { useCamera } from '../hooks/useCamera';
import { useHandDetection } from '../hooks/useHandDetection';
import { GESTURE_TYPES, GESTURE_INFO } from '../utils/gestureClassifier';
import { soundManager } from '../utils/soundEffects';

export default function Dashboard() {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  // 1. Camera Hook
  const {
    videoRef,
    cameraStatus,
    errorMessage,
    devices,
    currentDeviceId,
    isMirrored,
    videoDimensions,
    setIsMirrored,
    startCamera,
    stopCamera,
    switchCamera
  } = useCamera();

  // 2. Hand Detection & AI Engine Hook
  const {
    modelStatus,
    modelError,
    landmarks,
    allHandsLandmarks,
    handCount,
    currentGesture,
    fps,
    latency,
    totalDetections,
    gestureCounts,
    history,
    sessionDuration,
    clearHistory,
    isDemoMode,
    setIsDemoMode
  } = useHandDetection(videoRef, cameraStatus, isMirrored);

  // 3. Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (cameraStatus === 'active') {
          stopCamera();
        } else {
          setIsDemoMode(false);
          startCamera();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        const next = soundManager.toggleMute();
        setIsMuted(next);
      } else if (e.key === 'c' || e.key === 'C') {
        clearHistory();
      } else if (e.key === 'd' || e.key === 'D') {
        if (cameraStatus === 'active') stopCamera();
        setIsDemoMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraStatus, startCamera, stopCamera, clearHistory, setIsDemoMode]);

  // Gestures guide array
  const gesturesGuide = [
    { type: GESTURE_TYPES.OPEN_HAND, info: GESTURE_INFO[GESTURE_TYPES.OPEN_HAND] },
    { type: GESTURE_TYPES.FIST, info: GESTURE_INFO[GESTURE_TYPES.FIST] },
    { type: GESTURE_TYPES.THUMBS_UP, info: GESTURE_INFO[GESTURE_TYPES.THUMBS_UP] },
    { type: GESTURE_TYPES.VICTORY, info: GESTURE_INFO[GESTURE_TYPES.VICTORY] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gesture-electric/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gesture-primary animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-gesture-electric">
              AI Vision Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gesture-navy dark:text-white tracking-tight mt-1">
            Real-Time Hand Gesture Recognition
          </h1>
        </div>

        {/* Keyboard Shortcuts Hint Bar */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/40 px-3.5 py-2 rounded-xl border border-gesture-electric/15">
          <Keyboard className="w-3.5 h-3.5 text-gesture-electric" />
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">Space</kbd> Cam
          </span>
          <span>•</span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">D</kbd> Demo
          </span>
          <span>•</span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">M</kbd> Mute
          </span>
          <span>•</span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">C</kbd> Clear
          </span>
        </div>
      </div>

      {/* Quick Gestures Live Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gesturesGuide.map(({ type, info }) => {
          const isCurrentlyDetected = currentGesture?.gesture === type;
          return (
            <div
              key={type}
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                isCurrentlyDetected
                  ? 'border-gesture-primary bg-gesture-primary/10 shadow-glow-blue scale-[1.02]'
                  : 'border-gesture-electric/15 glass-card'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{info.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-gesture-navy dark:text-white">
                    {info.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isCurrentlyDetected ? 'ACTIVE RECOGNITION' : 'Ready'}
                  </div>
                </div>
              </div>

              {isCurrentlyDetected && (
                <span className="w-2 h-2 rounded-full bg-gesture-cyan animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* CORE 2-COLUMN SPLIT DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Live Camera Feed & Landmark Overlay (col-span-7) */}
        <div className="lg:col-span-7">
          <CameraFeed
            videoRef={videoRef}
            cameraStatus={cameraStatus}
            errorMessage={errorMessage}
            devices={devices}
            currentDeviceId={currentDeviceId}
            isMirrored={isMirrored}
            setIsMirrored={setIsMirrored}
            startCamera={startCamera}
            stopCamera={stopCamera}
            switchCamera={switchCamera}
            modelStatus={modelStatus}
            modelError={modelError}
            landmarks={landmarks}
            allHandsLandmarks={allHandsLandmarks}
            handCount={handCount}
            currentGesture={currentGesture}
            fps={fps}
            isDemoMode={isDemoMode}
            setIsDemoMode={setIsDemoMode}
          />
        </div>

        {/* RIGHT PANEL: AI Recognition Results & Telemetry (col-span-5) */}
        <div className="lg:col-span-5">
          <GestureResult
            currentGesture={currentGesture}
            handCount={handCount}
            fps={fps}
            latency={latency}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
          />
        </div>
      </div>

      {/* PERFORMANCE & SESSION ANALYTICS SECTION */}
      <AnalyticsPanel
        totalDetections={totalDetections}
        currentGesture={currentGesture}
        handCount={handCount}
        cameraStatus={cameraStatus}
        fps={fps}
        latency={latency}
        sessionDuration={sessionDuration}
        gestureCounts={gestureCounts}
        isDemoMode={isDemoMode}
      />

      {/* RECOGNITION TIMELINE HISTORY */}
      <GestureHistory
        history={history}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
