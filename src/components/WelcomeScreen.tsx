import React from 'react';
import { Camera, Sprout, ArrowRight, ScanLine } from 'lucide-react';
import { PiliAppLogo } from './PiliAppLogo';
import { playTap } from '../utils/haptics';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onOpenGuide: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onOpenGuide }) => {
  const handleStart = () => {
    playTap();
    onGetStarted();
  };

  const handleGuide = () => {
    playTap();
    onOpenGuide();
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] justify-between text-white font-sans overflow-hidden select-none">
      {/* High-Resolution Botanical Photographic Canvas */}
      <div className="absolute inset-0 z-0 bg-[#0E1510] overflow-hidden">
        <img
          src="/assets/aistudio/image_8d217ee2.png"
          alt="Authentic Pili harvest on wooden board"
          className="w-full h-full object-cover object-center opacity-65 filter brightness-[0.88] contrast-[1.08] scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Multilayered Atmospheric Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      </div>

      {/* Main Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-safe text-center max-w-sm mx-auto w-full">
        {/* Animated Brand Emblem with Radiant Halo */}
        <div className="relative mb-5 group cursor-pointer" onClick={handleGuide}>
          <PiliAppLogo size={80} withGlow={true} />
        </div>

        {/* Title: Big, Bold, Outfit Display Typography */}
        <h1 className="font-['Outfit'] font-black text-4xl sm:text-[44px] tracking-tight text-white leading-[1.08] mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          Pili Variety <br />
          <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
            Classifier
          </span>
        </h1>

        {/* Subtitle: Pili Fruit Clarification */}
        <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed max-w-[300px] mb-7 font-normal tracking-wide drop-shadow-sm">
          Capture or upload photos and instantly identify Pili fruit variety with detailed agricultural significance.
        </p>

        {/* Feature Cards - 3 Beveled Glassmorphic Pills */}
        <div className="w-full space-y-2.5 mb-6">
          <div className="relative overflow-hidden flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.12] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] text-left transition-all duration-200 group">
            <div className="flex-none flex items-center justify-center w-9 h-9 rounded-xl bg-black/25 text-white/95 border border-white/10 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-cyan-300 drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-[13px] font-semibold text-white tracking-tight block">
                Capture or upload images
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.12] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] text-left transition-all duration-200 group">
            <div className="flex-none flex items-center justify-center w-9 h-9 rounded-xl bg-black/25 text-white/95 border border-white/10 group-hover:scale-105 transition-transform">
              <Sprout className="w-4 h-4 text-lime-400 drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-[13px] font-semibold text-white tracking-tight block">
                Instant variety identification
              </span>
            </div>
          </div>

          {/* Third Feature Card Added: Specific to Pili Fruit */}
          <div className="relative overflow-hidden flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.12] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] text-left transition-all duration-200 group">
            <div className="flex-none flex items-center justify-center w-9 h-9 rounded-xl bg-black/25 text-white/95 border border-white/10 group-hover:scale-105 transition-transform">
              <ScanLine className="w-4 h-4 text-amber-300 drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-[13px] font-semibold text-white tracking-tight block">
                Whole Pili fruit classification
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action & Credit */}
      <div className="relative z-10 w-full px-6 pb-safe pt-2 flex flex-col items-center max-w-sm mx-auto">
        {/* Tactile Primary Pill Button */}
        <button
          type="button"
          onClick={handleStart}
          className="group relative w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#E1501E] to-[#C2410C] hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_12px_32px_rgba(234,88,12,0.42)] border-t border-white/30 transition-all duration-200 flex items-center justify-center gap-2 mb-3"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* User's Guide Link */}
        <button
          type="button"
          onClick={handleGuide}
          className="text-xs text-white/70 hover:text-white font-medium py-1 px-3 rounded-full hover:bg-white/10 transition-colors mb-3"
        >
          View User's Guide
        </button>

        {/* Creator Footnote */}
        <p className="text-[10px] text-white/50 tracking-tight text-center pb-2 font-mono">
          Created by one of the naughtiest kids in school.
        </p>
      </div>
    </div>
  );
};
