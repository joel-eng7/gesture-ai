import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Sliders,
  Shield,
  Lightbulb,
  Sun,
  Eye,
  Maximize2
} from 'lucide-react';
import Hand3DModel from '../components/Hand3DModel';
import GestureCard from '../components/GestureCard';
import { GESTURE_TYPES, GESTURE_INFO } from '../utils/gestureClassifier';
import { soundManager } from '../utils/soundEffects';

export default function GestureLibrary() {
  const [active3DPose, setActive3DPose] = useState('OPEN_HAND');

  const gestures = [
    {
      id: GESTURE_TYPES.OPEN_HAND,
      ...GESTURE_INFO[GESTURE_TYPES.OPEN_HAND],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Fully Extended', extended: true },
        { finger: 'Index', state: 'Fully Extended', extended: true },
        { finger: 'Middle', state: 'Fully Extended', extended: true },
        { finger: 'Ring', state: 'Fully Extended', extended: true },
        { finger: 'Pinky', state: 'Fully Extended', extended: true },
      ],
      geometricRules: [
        'Euclidean distance from Wrist (0) to each Tip (4, 8, 12, 16, 20) exceeds PIP distance by > 1.2x',
        'Joint straightness angle at PIP joints exceeds 135°',
        'Thumb tip separation from Index MCP exceeds 0.65 normalized hand scale',
        'Used for: Reset, Stop, Palm Gestures, Wave controls'
      ]
    },
    {
      id: GESTURE_TYPES.FIST,
      ...GESTURE_INFO[GESTURE_TYPES.FIST],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Folded / Tucked', extended: false },
        { finger: 'Index', state: 'Curled in Palm', extended: false },
        { finger: 'Middle', state: 'Curled in Palm', extended: false },
        { finger: 'Ring', state: 'Curled in Palm', extended: false },
        { finger: 'Pinky', state: 'Curled in Palm', extended: false },
      ],
      geometricRules: [
        'Fingertips (8, 12, 16, 20) positioned closely adjacent to palm base MCPs',
        'PIP joint flexion acute angles (< 115°)',
        'Wrist-to-tip distances smaller than or equal to wrist-to-PIP distances',
        'Used for: Grab, Hold, Drag, Confirm, Trigger events'
      ]
    },
    {
      id: GESTURE_TYPES.THUMBS_UP,
      ...GESTURE_INFO[GESTURE_TYPES.THUMBS_UP],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Pointing Upward', extended: true },
        { finger: 'Index', state: 'Folded in Palm', extended: false },
        { finger: 'Middle', state: 'Folded in Palm', extended: false },
        { finger: 'Ring', state: 'Folded in Palm', extended: false },
        { finger: 'Pinky', state: 'Folded in Palm', extended: false },
      ],
      geometricRules: [
        'Thumb Tip Y-coordinate is significantly higher than IP, MCP, and Wrist in camera coordinates',
        'Upward vertical vector alignment ratio > 0.40',
        'Other four fingers (Index, Middle, Ring, Pinky) meet strict fold criteria',
        'Used for: Approval, Like, Next item, Positive feedback'
      ]
    },
    {
      id: GESTURE_TYPES.VICTORY,
      ...GESTURE_INFO[GESTURE_TYPES.VICTORY],
      fingerBreakdown: [
        { finger: 'Thumb', state: 'Tucked Across', extended: false },
        { finger: 'Index', state: 'Fully Extended', extended: true },
        { finger: 'Middle', state: 'Fully Extended', extended: true },
        { finger: 'Ring', state: 'Folded in Palm', extended: false },
        { finger: 'Pinky', state: 'Folded in Palm', extended: false },
      ],
      geometricRules: [
        'Index and Middle fingers extended (> 135° straightness at PIP joints)',
        'Ring and Pinky fingers curled into palm',
        'Index Tip and Middle Tip have clear Euclidean separation (> 0.25 hand scale)',
        'Used for: Peace sign, Two, Select option B, Camera capture trigger'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gesture-electric">
          Anatomical Kinematic Models
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gesture-navy dark:text-white tracking-tight mt-2">
          Gesture Library
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          Explore the four core hand gesture models recognized by GESTURE AI. Each gesture is computed
          using 3D vector geometry, scale-invariant distances, and joint angle constraints.
        </p>
      </div>

      {/* Interactive 3D Pose Morphing Sandbox */}
      <div className="glass-card rounded-3xl p-6 border border-gesture-electric/25 shadow-glass">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gesture-electric">
              Interactive 3D Kinematics Preview
            </span>
            <h2 className="text-xl font-bold text-gesture-navy dark:text-white">
              Anatomical Hand Model Simulator
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Click a gesture below to test pose:</span>
          </div>
        </div>

        {/* 3D Hand Canvas */}
        <div className="w-full">
          <Hand3DModel defaultPose={active3DPose} interactive={true} />
        </div>
      </div>

      {/* 4 Detailed Gesture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gestures.map((card) => (
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
            isActive={active3DPose === card.id}
            onSelect={(id) => {
              soundManager.playClick();
              setActive3DPose(id);
            }}
          />
        ))}
      </div>

      {/* Best Practices for Optimal Recognition Guide */}
      <div className="glass-card rounded-3xl p-8 border border-gesture-electric/20 shadow-glass">
        <div className="flex items-center gap-2.5 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-extrabold text-gesture-navy dark:text-white">
            Best Practices For Optimal Tracking Accuracy
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
            <Sun className="w-5 h-5 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-gesture-navy dark:text-white mb-1">
              Balanced Lighting
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ensure front-facing or diffuse room light on your hands. Avoid intense backlighting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
            <Eye className="w-5 h-5 text-gesture-primary mb-2" />
            <h4 className="font-bold text-sm text-gesture-navy dark:text-white mb-1">
              Clear Hand Framing
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Keep your entire hand including the wrist clearly within the camera frame (0.5 to 1.5 meters away).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
            <Maximize2 className="w-5 h-5 text-gesture-electric mb-2" />
            <h4 className="font-bold text-sm text-gesture-navy dark:text-white mb-1">
              Distinct Finger Poses
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Form clear, deliberate poses. For Open Hand, splay all 5 fingers. For Fist, curl tightly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800">
            <Shield className="w-5 h-5 text-emerald-500 mb-2" />
            <h4 className="font-bold text-sm text-gesture-navy dark:text-white mb-1">
              Zero Latency Local
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No internet connection required after loading. High FPS processing runs locally on your CPU/GPU.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1677FF] via-[#258BFF] to-[#55D6FF] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow-blue">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Ready to test with your own webcam?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Launch the live AI recognition dashboard and see your hand gestures tracked in real time.
          </p>
        </div>

        <Link
          to="/dashboard"
          onClick={() => soundManager.playClick()}
          className="px-6 py-3.5 rounded-2xl bg-white text-gesture-primary hover:bg-blue-50 font-bold text-sm shadow-glass flex items-center gap-2 whitespace-nowrap transition-all transform hover:scale-105 active:scale-95"
        >
          <Camera className="w-4 h-4 text-gesture-primary" />
          <span>Launch AI Detection</span>
        </Link>
      </div>
    </div>
  );
}
