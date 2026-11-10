import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, ShieldCheck, Heart, Sparkles, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gesture-electric/15 bg-white/60 dark:bg-[#061325]/80 backdrop-blur-lg mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gesture-primary to-gesture-cyan p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#092B59] rounded-[10px] flex items-center justify-center">
                  <Hand className="w-5 h-5 text-white transform -rotate-12" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gesture-navy dark:text-white">
                GESTURE <span className="text-gradient-blue">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              "Your Hands. Your Commands. Powered by AI." Next-generation client-side hand tracking
              and gesture recognition built with MediaPipe, Three.js, and React.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Verified: 100% on-device processing. No video uploaded.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gesture-navy dark:text-white mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-gesture-primary dark:hover:text-gesture-cyan transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gesture-primary dark:hover:text-gesture-cyan transition-colors font-semibold text-gesture-primary dark:text-gesture-cyan">
                  Live AI Detection
                </Link>
              </li>
              <li>
                <Link to="/gestures" className="hover:text-gesture-primary dark:hover:text-gesture-cyan transition-colors">
                  Gesture Library (4 Poses)
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gesture-primary dark:hover:text-gesture-cyan transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gesture-primary dark:hover:text-gesture-cyan transition-colors">
                  About & Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Foundation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gesture-navy dark:text-white mb-3">
              AI & 3D Engine
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>MediaPipe Tasks Vision v0.10</li>
              <li>21 Hand Landmark Kinematics</li>
              <li>Three.js & React Three Fiber</li>
              <li>Temporal Hysteresis Smoothing</li>
              <li>HTML5 Canvas Hardware Acceleration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} GESTURE AI Studio. Designed for Academic & Production Computer Vision.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>using React & MediaPipe</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
