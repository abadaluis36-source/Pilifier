import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';
import { ClassificationResult, VARIETY_DATABASE } from '../services/classification';
import { playSuccessChime, playTap } from '../utils/haptics';

interface ResultScreenProps {
  result: ClassificationResult;
  previewUrl: string;
  onScanAgain: () => void;
  onBackToSource: () => void;
  onSelectSampleVariety?: (varietyKey: 'laysa' | 'lanuza' | 'unknownVariety' | 'unknownObject') => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  previewUrl,
  onScanAgain,
  onBackToSource,
}) => {
  useEffect(() => {
    playSuccessChime();
  }, [result.selectedLabel]);

  const details = result.details || VARIETY_DATABASE[result.selectedLabel] || {
    officialLabel: result.selectedLabel,
    scientificName: 'Canarium ovatum Engl.',
    statusTag: 'PREDICTED VARIETY',
    aboutTitle: `About ${result.selectedLabel.replace(' Variety', '')}`,
    aboutProse: 'Detailed agricultural classification and morphology evaluation.',
    identifyingCharacteristics: [],
  };

  const confidencePct = (result.confidence * 100).toFixed(1);

  const handleShare = () => {
    playTap();
    if (navigator.share) {
      navigator.share({
        title: `PILIFIER: ${result.selectedLabel}`,
        text: `Identified Pili Variety: ${result.selectedLabel} (${confidencePct}% confidence)`,
      }).catch(() => {});
    }
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] text-white font-sans overflow-hidden select-none">
      {/* Background with Dark Orchard Leaves & Ambient Vignette */}
      <div className="absolute inset-0 z-0 bg-[#0E1510] overflow-hidden">
        <img
          src="/assets/aistudio/image_df96da38.png"
          alt="Lush Pili orchard canopy"
          className="w-full h-full object-cover opacity-50 filter brightness-[0.78] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex-none flex items-center justify-between px-4 py-3 pt-safe">
        <button
          type="button"
          onClick={() => {
            playTap();
            onBackToSource();
          }}
          aria-label="Back to Source Selection"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
          Classification Result
        </h1>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share result"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Main Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-3 max-w-sm sm:max-w-md mx-auto w-full space-y-4">
        {/* Card 1: Captured Pili Image */}
        <div className="relative w-full rounded-3xl bg-white p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.35)] border border-white/30 overflow-hidden">
          <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Analyzed Pili Fruit"
              className="w-full h-full object-cover"
            />

            {/* Top-Right Floating Match Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-xs shadow-md border border-[#BBF7D0]">
              <CheckCircle2 className="w-3.5 h-3.5 fill-[#15803D] text-white" />
              <span>{confidencePct}% Match</span>
            </div>
          </div>
        </div>

        {/* Card 2: Editorial Botanical Specimen Card matching exact requested structure */}
        <div className="w-full rounded-3xl bg-white text-[#19251F] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.35)] border border-black/5">
          {/* Section: # Variety Name & PREDICTED VARIETY */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19251F] font-['Outfit'] tracking-tight leading-tight">
              {result.selectedLabel}
            </h2>
            <div className="text-[11px] font-bold tracking-widest text-[#15803D] uppercase mt-1">
              PREDICTED VARIETY
            </div>
          </div>

          {/* Section: # Confidence % & Note */}
          <div className="mb-5 pb-4 border-b border-black/10">
            <div className="text-4xl sm:text-5xl font-black font-['Outfit'] tabular-nums text-[#19251F] tracking-tight">
              {confidencePct}%
            </div>
            <div className="text-xs text-[#19251F]/60 font-medium mt-0.5">
              Model confidence — sample display only
            </div>
          </div>

          {/* Section: ## About Variety */}
          <div className="mb-5 pb-4 border-b border-black/10">
            <h3 className="text-base sm:text-lg font-bold text-[#19251F] tracking-tight mb-2">
              {details.aboutTitle}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#19251F]/80 leading-relaxed text-justify font-normal">
              {details.aboutProse}
            </p>
          </div>

          {/* Section: ## Identifying Characteristics */}
          <div className="mb-5">
            <h3 className="text-base sm:text-lg font-bold text-[#19251F] tracking-tight mb-3">
              Identifying Characteristics
            </h3>

            {details.identifyingCharacteristics && details.identifyingCharacteristics.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-[13px]">
                {details.identifyingCharacteristics.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#15803D] font-bold text-sm leading-none mt-0.5">•</span>
                    <div className="flex-1 leading-snug">
                      <span className="font-semibold text-[#19251F]">{item.label}:</span>{' '}
                      <span className="text-[#19251F]/80">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action Footer */}
      <footer className="relative z-10 flex-none w-full p-4 pb-safe bg-black/70 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="max-w-sm sm:max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              playTap();
              onBackToSource();
            }}
            className="min-h-[48px] py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-[0.98] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 border border-white/15 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Source</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              onScanAgain();
            }}
            className="min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#E1501E] to-[#C2410C] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 border-t border-white/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
