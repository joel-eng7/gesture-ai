import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Camera,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Workflow,
  Eye,
  Crosshair,
  Sliders
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import Hand3DModel from '../components/Hand3DModel';
import GestureCard from '../components/GestureCard';
import { GESTURE_TYPES, GESTURE_INFO } from '../utils/gestureClassifier';
import { soundManager } from '../utils/soundEffects';

export default function Home() {
  const [selectedPose, setSelectedPose] = useState('OPEN_HAND');

  const gestureCardsData = [
    {
      id: GESTURE_TYPES.OPEN_HAND,
      ...GESTURE_INFO[GESTURE_TYPES.OPEN_HAND],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Extended', extended: true },
        { finger: 'Index', state: 'Extended', extended: true },
        { finger: 'Middle', state: 'Extended', extended: true },
        { finger: 'Ring', state: 'Extended', extended: true },
        { finger: 'Pinky', state: 'Extended', extended: true },
      ],
      geometricRules: [
        'Tip-to-wrist distance exceeds PIP-to-wrist by > 1.2x',
        'All 5 PIP joint angles > 135° (straight fingers)',
        'Thumb tip separation > 0.65 normalized hand scale'
      ]
    },
    {
      id: GESTURE_TYPES.FIST,
      ...GESTURE_INFO[GESTURE_TYPES.FIST],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Folded', extended: false },
        { finger: 'Index', state: 'Folded', extended: false },
        { finger: 'Middle', state: 'Folded', extended: false },
        { finger: 'Ring', state: 'Folded', extended: false },
        { finger: 'Pinky', state: 'Folded', extended: false },
      ],
      geometricRules: [
        'All 4 finger tips curled below PIP joints',
        'Tip-to-MCP Euclidean distance minimized near palm',
        'PIP joint flexion angles < 115°'
      ]
    },
    {
      id: GESTURE_TYPES.THUMBS_UP,
      ...GESTURE_INFO[GESTURE_TYPES.THUMBS_UP],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Upward', extended: true },
        { finger: 'Index', state: 'Folded', extended: false },
        { finger: 'Middle', state: 'Folded', extended: false },
        { finger: 'Ring', state: 'Folded', extended: false },
        { finger: 'Pinky', state: 'Folded', extended: false },
      ],
      geometricRules: [
        'Thumb Tip Y-coordinate is significantly higher than IP, MCP & Wrist',
        'Index, Middle, Ring, Pinky remain tightly folded into palm',
        'Vertical vector alignment score > 0.60'
      ]
    },
    {
      id: GESTURE_TYPES.VICTORY,
      ...GESTURE_INFO[GESTURE_TYPES.VICTORY],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Folded', extended: false },
        { finger: 'Index', state: 'Extended', extended: true },
        { finger: 'Middle', state: 'Extended', extended: true },
        { finger: 'Ring', state: 'Folded', extended: false },
        { finger: 'Pinky', state: 'Folded', extended: false },
      ],
      geometricRules: [
        'Index and Middle fingers fully extended (> 135° at PIP)',
        'Ring and Pinky fingers folded tight into palm',
        'Significant angular/Euclidean spread between Index & Middle tips'
      ]
    }
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. HOW IT WORKS SECTION (Section 12 of prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-gesture-electric">
            Computer Vision Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gesture-navy dark:text-white tracking-tight mt-2">
            How It Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            From raw camera pixels to deterministic gesture recognition in under 15 milliseconds,
            processed entirely in your browser using cutting-edge WebAssembly.
          </p>
        </div>

        {/* 4 Animated Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-card-soft relative flex flex-col justify-between group hover:border-gesture-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gesture-primary/10 border border-gesture-primary/20 flex items-center justify-center text-gesture-primary dark:text-gesture-cyan font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-bold text-lg text-gesture-navy dark:text-white mb-2">
                Live Video Capture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Camera captures 60 FPS real-time webcam video stream via WebRTC MediaDevices API with client-side frame buffer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-gesture-electric">
              [getUserMedia // 1280x720]
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-card-soft relative flex flex-col justify-between group hover:border-gesture-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gesture-electric/10 border border-gesture-electric/20 flex items-center justify-center text-gesture-electric font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-bold text-lg text-gesture-navy dark:text-white mb-2">
                MediaPipe 21 Landmarks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                MediaPipe Hand Landmarker neural net detects 21 3D coordinate points across wrist, palm, and all 5 finger joints.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-gesture-electric">
              [WASM + SIMD // 21 Joints]
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-card-soft relative flex flex-col justify-between group hover:border-gesture-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gesture-cyan/15 border border-gesture-cyan/30 flex items-center justify-center text-gesture-cyan font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-bold text-lg text-gesture-navy dark:text-white mb-2">
                Kinematic Geometry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scale-invariant vector mathematics calculate joint angles, finger flexion ratios, and spatial thumb orientation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-gesture-electric">
              [Scale Invariant // Angles]
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-card-soft relative flex flex-col justify-between group hover:border-gesture-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">
                04
              </div>
              <h3 className="font-bold text-lg text-gesture-navy dark:text-white mb-2">
                Temporal Confirmation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sliding-window hysteresis filters jitter, confirms stable gestures, updates UI dashboard, and plays harmonic audio chime.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-500">
              [Hysteresis Buffer // Audio]
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE GESTURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gesture-electric">
              Precision Recognition Models
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gesture-navy dark:text-white tracking-tight mt-1">
              Supported Hand Gestures
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              All four gestures are classified through strict geometric vectors and spatial orientation.
            </p>
          </div>

          <Link
            to="/gestures"
            className="text-xs font-bold text-gesture-primary dark:text-gesture-cyan hover:underline flex items-center gap-1.5"
          >
            <span>View Full Gesture Documentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gestureCardsData.map((card) => (
            <GestureCard
              key={card.id}
              gestureId={card.id}
              name={card.name}
              description={card.description}
              emoji={card.emoji}
              color={card.color}
              accent={card.accent}
              fingerBreakdown={card.fingerBreakdown}
              geometricRules={card.geometricRules}
              isActive={selectedPose === card.id}
              onSelect={(id) => {
                soundManager.playClick();
                setSelectedPose(id);
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. PERFORMANCE & PRIVACY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-card p-8 lg:p-12 border border-gesture-electric/25 shadow-glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gesture-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gesture-electric flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Cloud Footprint • Full Privacy</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gesture-navy dark:text-white tracking-tight">
                Built For Speed. Engineered For Privacy.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Unlike cloud-dependent computer vision services that stream your webcam footage over the internet,
                GESTURE AI executes entirely in browser memory using WebAssembly. Your camera data never leaves your
                computer, ensuring zero privacy risk and ultra-low inference latency.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gesture-primary/10 flex items-center justify-center text-gesture-primary dark:text-gesture-cyan">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gesture-navy dark:text-white">60+ FPS</div>
                    <div className="text-[11px] text-slate-400">Silky smooth</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gesture-cyan/15 flex items-center justify-center text-gesture-cyan">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gesture-navy dark:text-white">Local WASM</div>
                    <div className="text-[11px] text-slate-400">Zero cloud API</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gesture-navy dark:text-white">No Storage</div>
                    <div className="text-[11px] text-slate-400">100% On-device</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <Link
                to="/dashboard"
                onClick={() => soundManager.playClick()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gesture-primary hover:bg-gesture-electric text-white font-bold text-center shadow-glow-blue flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>Open Live Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
