import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { playTap } from '../utils/haptics';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    playTap();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm max-h-[85vh] bg-[#162019]/95 backdrop-blur-2xl rounded-3xl p-6 text-white border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close Guide"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center pb-2">
          <h2 className="text-xl font-bold tracking-tight text-white drop-shadow">
            User's Guide
          </h2>
          {/* Subtle blue accent bar underneath as in screenshot */}
          <div className="w-10 h-1 bg-[#3B82F6] rounded-full mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-4 text-xs leading-relaxed text-white/85 text-left font-sans">
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <span className="font-semibold text-white block mb-0.5">
              1. Proper Placement
            </span>
            <p className="text-white/70 text-[11px]">
              Place a single Pili fruit on a flat, neutral background.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <span className="font-semibold text-white block mb-0.5">
              2. Lighting Condition
            </span>
            <p className="text-white/70 text-[11px]">
              Ensure even, soft lighting without heavy glare or deep shadows for optimal ridge detection.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <span className="font-semibold text-white block mb-0.5">
              3. Framing & Angle
            </span>
            <p className="text-white/70 text-[11px]">
              Align the Pili fruit within the viewfinder. The square guide will turn <strong className="text-[#4ade80] font-bold">GREEN</strong> when the angle is perfect for detection.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="font-bold text-[#F59E0B] text-xs block mb-1">
              • 5. Classify
            </span>
            <p className="text-white/90 text-xs">
              Once the box is green, tap capture. Wait a few seconds for the system to analyze the variety based on our expert database.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="font-bold text-[#F59E0B] text-xs block mb-1">
              • 6. Accuracy Tips
            </span>
            <p className="text-white/90 text-xs">
              If the results are unclear, retake the photo with better lighting or adjust the position.{' '}
              <strong className="text-white font-bold">
                For best accuracy, don't stop until you reach 100% or the highest possible confidence!
              </strong>{' '}
              One Pili at a time works best!
            </p>
          </div>
        </div>

        {/* Yellow Pill CTA matching screenshot */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#F2C01A] hover:bg-[#eab308] active:bg-[#ca8a04] active:scale-[0.98] text-[#19251F] font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(242,192,26,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#19251F]" />
            <span>I UNDERSTAND</span>
          </button>
        </div>
      </div>
    </div>
  );
};
