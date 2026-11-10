import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Sparkles,
  Camera,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Gamepad2,
  Accessibility,
  Tv,
  Presentation,
  Home,
  CheckCircle2
} from 'lucide-react';
import { LANDMARK_NAMES } from '../utils/landmarkUtils';
import { soundManager } from '../utils/soundEffects';

export default function About() {
  const [activeLandmarkTab, setActiveLandmarkTab] = useState('ALL');

  const techStack = [
    {
      name: 'MediaPipe Tasks Vision',
      category: 'Machine Learning',
      role: 'Hand Landmarker WebAssembly model detecting 21 3D hand coordinates with GPU acceleration.',
      badge: 'v0.10.17',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      name: 'Three.js & React Three Fiber',
      category: '3D Graphics',
      role: 'Procedural 3D articulated cybernetic hand model with dynamic lighting, materials & kinematics.',
      badge: 'r169',
      color: 'from-indigo-500 to-blue-400'
    },
    {
      name: 'Tailwind CSS & Glassmorphism',
      category: 'Styling & UI',
      role: 'Futuristic Blue & White design system with glassmorphic depth, glowing borders, and dark mode.',
      badge: 'v3.4',
      color: 'from-sky-400 to-blue-600'
    },
    {
      name: 'Deterministic Geometric Engine',
      category: 'Computer Vision',
      role: 'Scale-invariant vector mathematics, angle computation, and temporal hysteresis smoothing.',
      badge: 'Custom ES6',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      name: 'Web Audio API',
      category: 'Audio Synthesizer',
      role: 'Hardware-synthesized harmonic dual-tone chimes for gesture confirmations with zero asset latency.',
      badge: 'Native AudioCtx',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'React 18 & Vite',
      category: 'Frontend Core',
      role: 'High-performance reactive frontend framework with lightning-fast Hot Module Replacement.',
      badge: 'Vite 5',
      color: 'from-blue-400 to-purple-500'
    }
  ];

  const applications = [
    {
      icon: Tv,
      title: 'Touchless Computer Control',
      description: 'Navigate slides, control media volume, pause movies, and trigger actions without touching a mouse or keyboard in sterile or hands-busy environments.'
    },
    {
      icon: Accessibility,
      title: 'Assistive Accessibility',
      description: 'Enables users with limited motor skills or physical speech impairments to communicate and command software through clear hand signs.'
    },
    {
      icon: Home,
      title: 'Smart Home Automation',
      description: 'Integrate with IoT bridges to toggle smart room lights with an Open Hand, adjust thermostats, or lock doors with a Fist gesture.'
    },
    {
      icon: Gamepad2,
      title: 'Next-Gen Motion Gaming',
      description: 'Direct browser-based motion control for casual, interactive, and VR web games without expensive external hardware trackers.'
    },
    {
      icon: Presentation,
      title: 'Interactive Keynotes',
      description: 'Presenters can advance presentation decks or zoom into schematics on projection screens using natural hand gestures.'
    },
    {
      icon: Globe,
      title: 'HCI & Medical Kiosks',
      description: 'Public interactive directory kiosks, museum exhibits, and hygienic hospital terminals requiring sanitary zero-contact interaction.'
    }
  ];

  const landmarkGroups = {
    WRIST: [0],
    THUMB: [1, 2, 3, 4],
    INDEX: [5, 6, 7, 8],
    MIDDLE: [9, 10, 11, 12],
    RING: [13, 14, 15, 16],
    PINKY: [17, 18, 19, 20]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gesture-electric">
          System Architecture & Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gesture-navy dark:text-white tracking-tight mt-2">
          About GESTURE AI
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          GESTURE AI bridges human intent and digital computing through browser-native computer vision.
          Built with MediaPipe, Three.js, and deterministic geometric classification.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gesture-electric">
              Under The Hood
            </span>
            <h2 className="text-2xl font-bold text-gesture-navy dark:text-white">
              Technology Stack
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-card-soft flex flex-col justify-between hover:border-gesture-primary transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan font-mono">
                    {tech.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {tech.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gesture-navy dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tech.role}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-gesture-electric">
                <CheckCircle2 className="w-3.5 h-3.5 text-gesture-cyan" />
                <span className="font-medium text-[11px]">Free, Open-Source & Client-Side</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MediaPipe 21 Hand Landmarks Reference Guide */}
      <section className="glass-card rounded-3xl p-8 border border-gesture-electric/25 shadow-glass space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gesture-electric">
              Kinematic Skeletal Map
            </span>
            <h2 className="text-2xl font-bold text-gesture-navy dark:text-white">
              MediaPipe 21 Hand Landmarks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Every hand detected is represented by 21 3D landmark points normalized to screen space.
            </p>
          </div>

          {/* Group Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {['ALL', 'THUMB', 'INDEX', 'MIDDLE', 'RING', 'PINKY'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundManager.playClick();
                  setActiveLandmarkTab(tab);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeLandmarkTab === tab
                    ? 'bg-gesture-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 21 Landmarks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5">
          {Object.entries(LANDMARK_NAMES)
            .filter(([idx]) => {
              if (activeLandmarkTab === 'ALL') return true;
              return landmarkGroups[activeLandmarkTab]?.includes(Number(idx));
            })
            .map(([idx, name]) => {
              const num = Number(idx);
              const isWrist = num === 0;
              const isTip = [4, 8, 12, 16, 20].includes(num);

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isWrist
                      ? 'border-gesture-primary bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan font-bold'
                      : isTip
                      ? 'border-gesture-cyan bg-gesture-cyan/10 text-gesture-electric dark:text-gesture-cyan'
                      : 'border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="font-mono text-sm font-black mb-1">
                    #{idx}
                  </div>
                  <div className="text-[10px] uppercase font-semibold tracking-tight truncate">
                    {name.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    {isWrist ? 'Anchor' : isTip ? 'Fingertip' : 'Joint'}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Real-World HCI Applications */}
      <section className="space-y-6">
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gesture-electric">
            Human-Computer Interaction
          </span>
          <h2 className="text-2xl font-bold text-gesture-navy dark:text-white">
            Real-World Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.title}
                className="glass-card rounded-3xl p-6 border border-gesture-electric/15 shadow-card-soft flex flex-col justify-start hover:border-gesture-primary transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gesture-light dark:bg-gesture-darkCard border border-gesture-electric/25 flex items-center justify-center text-gesture-primary dark:text-gesture-cyan mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-gesture-navy dark:text-white mb-2">
                  {app.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {app.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Launch CTA */}
      <div className="rounded-3xl glass-card p-8 border border-gesture-primary/40 shadow-glow-blue text-center flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-gesture-cyan animate-pulse" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gesture-navy dark:text-white">
          Experience GESTURE AI Live
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg">
          No installation or registration needed. Run the vision model directly inside your browser.
        </p>
        <Link
          to="/dashboard"
          onClick={() => soundManager.playClick()}
          className="px-8 py-3.5 rounded-2xl bg-gesture-primary hover:bg-gesture-electric text-white font-bold text-sm shadow-glow-blue flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Launch AI Recognition Console</span>
        </Link>
      </div>
    </div>
  );
}
