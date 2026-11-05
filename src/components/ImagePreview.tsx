import React from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { playTap } from '../utils/haptics';

interface ImagePreviewProps {
  imageFile: File;
  previewUrl: string;
  onRetake: () => void;
  onIdentify: () => void;
  onUploadDifferent: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  previewUrl,
  onRetake,
  onIdentify,
  onUploadDifferent,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRetake = () => {
    playTap();
    onRetake();
  };

  const handleIdentify = () => {
    playTap();
    onIdentify();
  };

  const handleDifferent = () => {
    playTap();
    onUploadDifferent();
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] text-white font-sans overflow-hidden select-none">
      {/* Background Image with Ambient Scrim */}
      <div className="absolute inset-0 z-0 bg-[#0E1510] overflow-hidden">
        <img
          src="/assets/aistudio/image_df96da38.png"
          alt="Lush Pili orchard canopy"
          className="w-full h-full object-cover opacity-50 filter brightness-[0.8] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/85" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex-none flex items-center justify-between px-4 py-3 pt-safe">
        <button
          type="button"
          onClick={handleRetake}
          aria-label="Back"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
          Review Pili Photo
        </h1>

        <button
          type="button"
          onClick={handleDifferent}
          aria-label="Change photo"
          className="text-xs font-semibold text-[#F2C01A] hover:underline px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Change
        </button>
      </header>

      {/* Main Image Viewport Area */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center p-4 max-w-sm mx-auto min-h-0">
        <div className="relative w-full h-full max-h-[60vh] rounded-3xl overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.5)] border border-white/25 bg-white/10 backdrop-blur-xl flex items-center justify-center p-2">
          <img
            src={previewUrl}
            alt="Captured Pili nut for classification"
            className="w-full h-full object-contain rounded-2xl"
          />

          {/* Clean unboxed file metadata */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-xl text-white flex items-center justify-between text-xs font-mono border border-white/10 shadow-lg">
            <span className="truncate max-w-[180px] font-sans font-medium text-white/90">
              {imageFile.name}
            </span>
            <span className="text-white/70">
              {formatFileSize(imageFile.size)}
            </span>
          </div>
        </div>

        <p className="text-xs text-white/80 mt-3 text-center max-w-xs font-medium">
          Make sure the shell surface and ridges are sharp and well-lit.
        </p>
      </main>

      {/* Bottom Sticky Action Footer */}
      <footer className="relative z-10 flex-none w-full p-4 pb-safe bg-black/70 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="max-w-sm sm:max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleRetake}
            className="min-h-[50px] px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-[0.98] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 border border-white/15 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-white/80" />
            <span>Retake</span>
          </button>

          <button
            type="button"
            onClick={handleIdentify}
            className="min-h-[50px] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#E1501E] to-[#C2410C] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-orange-950/40 border-t border-white/25 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#F2C01A]" />
            <span>Identify Variety</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
