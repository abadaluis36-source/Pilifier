import React from 'react';
import { PiliAppLogo } from './PiliAppLogo';

interface ClassificationLoadingProps {
  previewUrl: string;
}

export const ClassificationLoading: React.FC<ClassificationLoadingProps> = ({ previewUrl }) => {
  return (
    <div className="relative flex flex-col w-full h-[100dvh] text-white font-sans items-center justify-between p-6 select-none overflow-hidden">
      {/* Background with Dark Orchard Leaves & Ambient Vignette */}
      <div className="absolute inset-0 z-0 bg-[#0E1510] overflow-hidden">
        <img
          src="/assets/aistudio/image_df96da38.png"
          alt="Lush Pili orchard canopy"
          className="w-full h-full object-cover opacity-50 filter brightness-[0.78] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center gap-2.5 pt-safe">
        <PiliAppLogo size={36} withGlow={true} />
        <h1 className="text-base font-bold tracking-tight text-white drop-shadow">
          Classify Pili Variety
        </h1>
      </header>

      {/* Center Image with Scanning Laser Sweep */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Glowing halo behind container */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative w-56 h-72 rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.6)] border-2 border-white/25 bg-black/30 p-1 backdrop-blur-xl">
            <img
              src={previewUrl}
              alt="Pili nut being analyzed"
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Glowing Laser Scan Beam */}
            <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_20px_#22C55E] animate-[bounce_2s_ease-in-out_infinite]" />

            {/* Subtle botanical grid crosshairs */}
            <div className="absolute inset-4 rounded-xl border border-dashed border-white/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Loading Spinner & Label */}
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-3 border-white/15 border-t-[#22C55E] border-r-[#F2C01A] animate-spin shadow-lg" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#EA580C] shadow-[0_0_8px_#EA580C]" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1.5 drop-shadow">
            Analyzing Pili...
          </h2>
          <p className="text-xs text-white/75 max-w-xs leading-relaxed font-normal">
            Evaluating fruit morphology, ridges, and variety markers based on our expert database
          </p>
        </div>
      </div>

      {/* Footnote */}
      <footer className="relative z-10 pb-safe text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] text-white/70 font-mono tracking-tight">
            TensorFlow Lite MobileNetV2 Pipeline
          </span>
        </div>
      </footer>
    </div>
  );
};
