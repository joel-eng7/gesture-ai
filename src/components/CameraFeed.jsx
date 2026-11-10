import React, { useState } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  FlipHorizontal,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Loader2,
  Video
} from 'lucide-react';
import LandmarkOverlay from './LandmarkOverlay';

export default function CameraFeed({
  videoRef,
  cameraStatus,
  errorMessage,
  devices,
  currentDeviceId,
  isMirrored,
  setIsMirrored,
  startCamera,
  stopCamera,
  switchCamera,
  modelStatus,
  modelError,
  landmarks,
  allHandsLandmarks,
  handCount,
  currentGesture,
  fps,
  isDemoMode,
  setIsDemoMode
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);

  const isCameraActive = cameraStatus === 'active';
  const isModelReady = modelStatus === 'ready';
  const isModelLoading = modelStatus === 'loading';

  // Status Indicator helper
  const getStatusBadge = () => {
    if (isDemoMode) {
      return {
        label: 'Demo Hand Simulation Active',
        color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500'
      };
    }
    if (cameraStatus === 'initializing' || isModelLoading) {
      return {
        label: isModelLoading ? 'Initializing AI Model (Local WASM)...' : 'Connecting to Camera...',
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500 animate-pulse'
      };
    }
    if (cameraStatus === 'denied') {
      return {
        label: 'Camera Permission Denied',
        color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500'
      };
    }
    if (cameraStatus === 'error' || cameraStatus === 'unavailable') {
      return {
        label: errorMessage || 'Camera Unavailable',
        color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500'
      };
    }
    if (isCameraActive) {
      if (handCount > 0) {
        return {
          label: `Hand Detected (${handCount} ${handCount === 1 ? 'hand' : 'hands'})`,
          color: 'bg-gesture-primary/15 text-gesture-primary dark:text-gesture-cyan border-gesture-primary/30',
          dot: 'bg-gesture-cyan animate-ping'
        };
      }
      return {
        label: 'No Hand in Frame',
        color: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
        dot: 'bg-slate-400'
      };
    }
    return {
      label: 'Camera Standby',
      color: 'bg-blue-500/10 text-gesture-electric border-blue-500/20',
      dot: 'bg-gesture-electric'
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="flex flex-col gap-3">
      {/* Viewport Card */}
      <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden glass-card border border-gesture-electric/20 shadow-glass bg-slate-950/5 dark:bg-black/40 flex items-center justify-center">
        {/* Real HTML5 Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0 hidden'
          } ${isMirrored ? 'scale-x-[-1]' : ''}`}
          playsInline
          muted
        />

        {/* Demo Mode Background when active */}
        {isDemoMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#092B59]/90 to-[#061325]/95 flex items-center justify-center">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #55D6FF 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />
            <div className="text-center p-6 max-w-sm pointer-events-none z-0">
              <Sparkles className="w-10 h-10 text-gesture-cyan mx-auto mb-2 animate-pulse" />
              <h4 className="text-white font-bold text-lg">Synthetic Hand Simulator</h4>
              <p className="text-xs text-gesture-light/70 mt-1">
                Generating mathematically rigorous 21-point landmarks cycling through all 4 test gestures.
              </p>
            </div>
          </div>
        )}

        {/* Real-Time Landmark Overlay Canvas */}
        {(isCameraActive || isDemoMode) && (
          <LandmarkOverlay
            landmarks={landmarks}
            allHandsLandmarks={allHandsLandmarks}
            videoRef={videoRef}
            isMirrored={isMirrored}
            currentGesture={currentGesture}
            showSkeleton={showSkeleton}
            showBoundingBox={showBoundingBox}
          />
        )}

        {/* Placeholder Screen when Camera is Stopped / Off */}
        {!isCameraActive && !isDemoMode && (
          <div className="flex flex-col items-center justify-center text-center p-6 z-0">
            <div className="w-16 h-16 rounded-2xl bg-gesture-light dark:bg-gesture-darkCard flex items-center justify-center text-gesture-primary dark:text-gesture-cyan mb-4 shadow-glass border border-gesture-electric/20">
              {isModelLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : cameraStatus === 'denied' ? (
                <ShieldAlert className="w-8 h-8 text-rose-500" />
              ) : (
                <Video className="w-8 h-8" />
              )}
            </div>

            <h3 className="font-bold text-lg text-gesture-navy dark:text-white">
              {cameraStatus === 'denied'
                ? 'Camera Permission Blocked'
                : cameraStatus === 'unavailable'
                ? 'No Camera Available'
                : isModelLoading
                ? 'Loading AI Landmarker Model...'
                : 'Webcam Ready for AI Tracking'}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 mb-6">
              {cameraStatus === 'denied'
                ? 'Camera access is required for real-time gesture recognition. Enable camera permissions in your browser or try Demo Simulation mode.'
                : cameraStatus === 'unavailable'
                ? 'A video camera was not found. You can test all 4 gestures using the built-in synthetic hand simulation below.'
                : 'All video processing happens 100% locally in your browser. No camera feed is recorded, uploaded, or transmitted.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => startCamera()}
                disabled={isModelLoading}
                className="px-5 py-2.5 rounded-xl bg-gesture-primary hover:bg-gesture-electric text-white font-semibold text-sm shadow-glow-blue flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera</span>
              </button>

              <button
                onClick={() => setIsDemoMode(true)}
                className="px-4 py-2.5 rounded-xl border border-gesture-electric/40 bg-white/70 dark:bg-gesture-darkCard text-gesture-navy dark:text-gesture-light font-medium text-sm hover:border-gesture-primary shadow-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-gesture-cyan" />
                <span>Try Demo Simulator</span>
              </button>
            </div>
          </div>
        )}

        {/* HUD Top Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-2 shadow-sm ${statusBadge.color}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
            <span>{statusBadge.label}</span>
          </div>

          {/* FPS Counter Pill */}
          {(isCameraActive || isDemoMode) && (
            <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] flex items-center gap-2">
              <span className="text-gesture-cyan font-bold">{fps}</span>
              <span className="text-slate-400">FPS</span>
            </div>
          )}
        </div>

        {/* Top-Right Hand Count Pill */}
        {(isCameraActive || isDemoMode) && (
          <div className="absolute top-12 right-3 pointer-events-none z-20">
            <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gesture-primary" />
              <span>HANDS: {handCount}</span>
            </div>
          </div>
        )}

        {/* Bottom Corner HUD Accents */}
        <div className="absolute bottom-3 left-3 pointer-events-none z-20 font-mono text-[10px] text-white/70 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
          <span>MEDIAPIPE_HAND_LANDMARKER // 21_JOINTS</span>
        </div>
      </div>

      {/* Camera Controls Panel */}
      <div className="glass-card rounded-2xl p-3 border border-gesture-electric/20 shadow-glass flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsDemoMode(false);
                startCamera();
              }}
              disabled={isModelLoading}
              className="px-4 py-2 rounded-xl bg-gesture-primary hover:bg-gesture-electric text-white text-xs font-semibold shadow-glow-blue flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start Camera</span>
            </button>
          )}

          {/* Switch Camera Button (enabled if multiple devices exist) */}
          {devices.length > 1 && (
            <button
              onClick={switchCamera}
              title="Switch to another camera"
              className="px-3 py-2 rounded-xl border border-gesture-electric/20 hover:bg-gesture-light dark:hover:bg-gesture-darkCard text-gesture-navy dark:text-gesture-light text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gesture-primary" />
              <span>Switch ({devices.length})</span>
            </button>
          )}

          {/* Mirror Flip Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            title="Mirror camera display"
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isMirrored
                ? 'border-gesture-primary bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan'
                : 'border-gesture-electric/20 text-slate-600 dark:text-slate-300 hover:bg-gesture-light dark:hover:bg-gesture-darkCard'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mirror</span>
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          {/* Skeleton Overlay Toggle */}
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            title="Toggle landmark skeleton overlay"
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              showSkeleton
                ? 'border-gesture-cyan bg-gesture-cyan/10 text-gesture-electric dark:text-gesture-cyan'
                : 'border-gesture-electric/20 text-slate-500'
            }`}
          >
            {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Skeleton</span>
          </button>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => {
              if (isCameraActive) stopCamera();
              setIsDemoMode(!isDemoMode);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isDemoMode
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'border-gesture-electric/20 text-slate-600 dark:text-slate-300 hover:bg-gesture-light dark:hover:bg-gesture-darkCard'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isDemoMode ? 'Exit Demo' : 'Simulate Hand'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
