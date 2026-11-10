import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  BookOpen,
  HelpCircle,
  Info,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Hand
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('gesture_ai_theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    soundManager.playClick();
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gesture_ai_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gesture_ai_theme', 'dark');
      setIsDark(true);
    }
  };

  const toggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Live Detection', icon: Camera, highlight: true },
    { to: '/gestures', label: 'Gesture Library', icon: BookOpen },
    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 dark:bg-[#061325]/80 border-b border-gesture-electric/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group select-none"
          onClick={() => soundManager.playClick()}
        >
          {/* Custom Futuristic Hand Symbol */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1677FF] to-[#55D6FF] p-0.5 shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#092B59] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              {/* Internal grid accent */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#55D6FF_1px,transparent_1px)] [background-size:6px_6px]" />
              <Hand className="w-6 h-6 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-gesture-navy dark:text-white flex items-center gap-1.5">
              <span>GESTURE</span>
              <span className="text-gradient-blue">AI</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gesture-electric dark:text-gesture-cyan font-semibold">
              Vision Studio
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => soundManager.playClick()}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                  isActive
                    ? 'text-gesture-primary dark:text-gesture-cyan bg-gesture-light dark:bg-gesture-darkCard shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-gesture-navy dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gesture-primary dark:text-gesture-cyan' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS: THEME, SOUND & LAUNCH BUTTON */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-xl border border-gesture-electric/20 hover:bg-gesture-light dark:hover:bg-gesture-darkCard text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gesture-primary dark:text-gesture-cyan" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl border border-gesture-electric/20 hover:bg-gesture-light dark:hover:bg-gesture-darkCard text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gesture-navy" />
            )}
          </button>

          {/* Prominent Launch AI Button */}
          <Link
            to="/dashboard"
            onClick={() => soundManager.playClick()}
            className="relative group px-5 py-2.5 rounded-xl bg-gradient-to-r from-gesture-primary via-gesture-electric to-gesture-primary bg-[length:200%_auto] hover:bg-right text-white font-semibold text-sm shadow-glow-blue flex items-center gap-2 transition-all duration-300 transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-gesture-cyan animate-pulse" />
            <span>Launch AI</span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gesture-electric/20 text-slate-600 dark:text-slate-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-gesture-electric/20 text-gesture-navy dark:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gesture-electric/20 bg-white/95 dark:bg-[#061325]/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'text-gesture-primary dark:text-gesture-cyan bg-gesture-light dark:bg-gesture-darkCard'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-gesture-electric" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              to="/dashboard"
              onClick={() => {
                soundManager.playClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gesture-primary text-white font-semibold text-center flex items-center justify-center gap-2 shadow-glow-blue"
            >
              <Sparkles className="w-4 h-4 text-gesture-cyan" />
              <span>Launch AI Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
