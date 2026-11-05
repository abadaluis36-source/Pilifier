import React, { useRef } from 'react';
import { ArrowLeft, Camera, Upload, HelpCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { playTap } from '../utils/haptics';

interface SourceSelectionScreenProps {
  onBack: () => void;
  onOpenLiveCamera: () => void;
  onImageSelected: (file: File, previewUrl: string) => void;
  onOpenGuide: () => void;
}

export const SourceSelectionScreen: React.FC<SourceSelectionScreenProps> = ({
  onBack,
  onOpenLiveCamera,
  onImageSelected,
  onOpenGuide,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playTap();
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  };

  const handleCameraClick = () => {
    playTap();
    onOpenLiveCamera();
  };

  const handleGalleryClick = () => {
    playTap();
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] text-white font-sans overflow-hidden select-none">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Lush Pili Orchard Tree Background with Specular Tone */}
      <div className="absolute inset-0 z-0 bg-[#0E1510] overflow-hidden">
        <img
          src="/assets/aistudio/image_df96da38.png"
          alt="Lush Pili orchard canopy"
          className="w-full h-full object-cover opacity-55 filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 flex-none flex items-center justify-between px-4 py-3 pt-safe">
        <button
          type="button"
          onClick={() => {
            playTap();
            onBack();
          }}
          aria-label="Go back to welcome screen"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
          Classify Pili Variety
        </h1>

        <button
          type="button"
          onClick={() => {
            playTap();
            onOpenGuide();
          }}
          aria-label="Open User's Guide"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-[#F2C01A] backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-sm group"
        >
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </header>

      {/* Main Selection Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-sm mx-auto w-full text-center">
        {/* Emblem: Mountain/Sun landscape emblem in frosted halo */}
        <div className="relative mb-5 group">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-125" />
          <div className="relative w-24 h-24 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white to-slate-100 shadow-md flex items-center justify-center overflow-hidden p-2.5">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <circle cx="14" cy="14" r="4" fill="#F59E0B" />
                <path
                  d="M4 34 L16 19 L25 29 L36 16 L40 34 Z"
                  fill="#22C55E"
                />
                <path
                  d="M17 34 L26 23 L37 34 Z"
                  fill="#15803D"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Headline & Description */}
        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 drop-shadow-sm">
          Choose Image Source
        </h2>
        <p className="text-xs text-white/80 leading-relaxed max-w-xs mb-7 font-normal">
          Take a clear photo or upload an image of a Pili fruit to identify its variety
        </p>

        {/* Selection Cards */}
        <div className="w-full space-y-3.5">
          {/* Card 1: Capture Photo */}
          <button
            type="button"
            onClick={handleCameraClick}
            className="group relative w-full p-4 rounded-3xl bg-white/[0.12] hover:bg-white/[0.18] active:bg-white/[0.22] backdrop-blur-xl border border-white/20 text-white flex items-center justify-between text-left active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform text-white/95 shadow-inner">
                <Camera className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight block">
                  Capture Photo
                </span>
                <span className="text-[11px] text-white/70">
                  Use your camera
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Upload from Gallery */}
          <button
            type="button"
            onClick={handleGalleryClick}
            className="group relative w-full p-4 rounded-3xl bg-white/[0.12] hover:bg-white/[0.18] active:bg-white/[0.22] backdrop-blur-xl border border-white/20 text-white flex items-center justify-between text-left active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform text-white/95 shadow-inner">
                <Upload className="w-6 h-6 text-lime-300" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight block">
                  Upload from Gallery
                </span>
                <span className="text-[11px] text-white/70">
                  Select from library
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer Tip */}
      <footer className="relative z-10 flex-none pb-safe pt-2 text-center">
        <p className="text-xs text-white/80 flex items-center justify-center gap-1.5 pb-3 font-medium">
          <Lightbulb className="w-4 h-4 text-[#F2C01A]" />
          <span>Ensure good lighting for best results</span>
        </p>
      </footer>
    </div>
  );
};
