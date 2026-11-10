import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';
import Hand3DModel from './Hand3DModel';
import { soundManager } from '../utils/soundEffects';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-16">
      {/* Background Soft Blue Glowing Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-gesture-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/10 w-[500px] h-[500px] rounded-full bg-gesture-cyan/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT SIDE CONTENT (col-span-7) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-gesture-electric/30 shadow-sm text-xs font-bold text-gesture-primary dark:text-gesture-cyan mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gesture-cyan" />
              <span>NEXT-GENERATION COMPUTER VISION</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gesture-navy dark:text-white tracking-tight leading-[1.12] mb-6">
              Control Technology <br />
              With <span className="text-gradient-blue">Your Hands.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
              Experience intelligent real-time hand gesture recognition. Transform simple hand movements
              into meaningful digital interactions using AI-powered computer vision.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              {/* Button 1: Start Recognition */}
              <Link
                to="/dashboard"
                onClick={() => soundManager.playClick()}
                className="px-6 py-3.5 rounded-2xl bg-gesture-primary hover:bg-gesture-electric text-white font-bold text-sm shadow-glow-blue flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Start Recognition</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Button 2: Explore Gestures */}
              <Link
                to="/gestures"
                onClick={() => soundManager.playClick()}
                className="px-6 py-3.5 rounded-2xl border border-gesture-electric/30 bg-white/70 dark:bg-gesture-darkCard/80 hover:bg-white dark:hover:bg-gesture-darkCard text-gesture-navy dark:text-gesture-light font-semibold text-sm shadow-card-soft hover:border-gesture-primary flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-gesture-electric" />
                <span>Explore Gestures</span>
              </Link>
            </div>

            {/* Supporting Information Badges */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full grid grid-cols-3 gap-3">
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-gesture-navy dark:text-white">
                  4 Gestures
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Precision Classified
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-gesture-navy dark:text-white flex items-center gap-1">
                  <span>&lt; 15 ms</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Real-Time Detection
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-gesture-navy dark:text-white">
                  100% Local
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Browser-Based AI
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: 3D INTERACTIVE HAND (col-span-5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Outer Frame with Glass Card Styling */}
            <div className="relative rounded-3xl p-2 glass-card border border-gesture-electric/25 shadow-glass-hover">
              <Hand3DModel interactive={true} defaultPose="OPEN_HAND" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
