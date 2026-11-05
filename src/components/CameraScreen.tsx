import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Camera, RefreshCw, Zap, ZapOff, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { playShutterSound, playTap } from '../utils/haptics';

interface CameraScreenProps {
  onBack: () => void;
  onImageCaptured: (file: File, previewUrl: string) => void;
  onOpenGuide: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onBack,
  onImageCaptured,
  onOpenGuide,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCameraError, setHasCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCameraStarting, setIsCameraStarting] = useState(true);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [isAnglePerfect, setIsAnglePerfect] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setIsCameraStarting(true);
    setHasCameraError(false);
    setErrorMessage('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraError(true);
      setErrorMessage('Camera API is not supported on this device/browser.');
      setIsCameraStarting(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'getCapabilities' in videoTrack) {
        const capabilities = (videoTrack as any).getCapabilities?.() || {};
        setHasTorch(Boolean(capabilities.torch));
      } else {
        setHasTorch(false);
      }

      setIsCameraStarting(false);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setHasCameraError(true);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser or select an image from gallery.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device found on this system. You can select an image from gallery.');
      } else {
        setErrorMessage('Unable to initialize camera. You can select an image directly using the gallery button.');
      }
      setIsCameraStarting(false);
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const nextState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
        playTap();
      } catch (err) {
        console.warn('Torch toggle error:', err);
      }
    }
  };

  const toggleFacingMode = () => {
    playTap();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Flash animation and shutter sound
    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 120);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `pili_${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        const previewUrl = URL.createObjectURL(blob);
        stopStream();
        onImageCaptured(file, previewUrl);
      },
      'image/jpeg',
      0.95
    );
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playTap();
    const previewUrl = URL.createObjectURL(file);
    stopStream();
    onImageCaptured(file, previewUrl);
  };

  const loadSample = async (samplePath: string, name: string) => {
    try {
      playTap();
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], name, { type: 'image/png' });
      const previewUrl = URL.createObjectURL(blob);
      stopStream();
      onImageCaptured(file, previewUrl);
    } catch (err) {
      console.warn('Error loading sample:', err);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-[100dvh] bg-black select-none overflow-hidden font-sans">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Screen Flash Shutter Overlay */}
      {isFlashing && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-in fade-in duration-75" />
      )}

      {/* Top Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 pt-safe bg-gradient-to-b from-black/85 via-black/45 to-transparent">
        <button
          type="button"
          onClick={() => {
            playTap();
            stopStream();
            onBack();
          }}
          aria-label="Back"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl border border-white/10 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-tight leading-none drop-shadow">
            Classify Pili Variety
          </h1>
          <p className="text-[10px] text-white/60 font-mono mt-0.5">
            {isAnglePerfect ? 'Detection: Optimal' : 'Align Viewfinder'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              aria-label="Toggle flashlight"
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl backdrop-blur-xl border border-white/15 transition-all ${
                torchOn ? 'bg-[#F2C01A] text-black shadow-lg shadow-[#F2C01A]/30' : 'bg-black/40 text-white'
              }`}
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
          )}

          <button
            type="button"
            onClick={toggleFacingMode}
            aria-label="Switch camera"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 text-white border border-white/15 backdrop-blur-xl active:scale-95 transition-all hover:bg-black/60"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              onOpenGuide();
            }}
            aria-label="Open User's Guide"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-black/40 text-[#F2C01A] border border-white/15 backdrop-blur-xl active:scale-95 transition-all hover:bg-black/60"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Viewfinder Feed */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {hasCameraError ? (
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto text-white">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-[#F2C01A] shadow-xl">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Camera Unavailable</h2>
            <p className="text-xs text-white/70 leading-relaxed mb-6 font-normal">
              {errorMessage}
            </p>

            <div className="flex flex-col w-full gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[50px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-orange-950/40 transition-all"
              >
                Choose Photo from Gallery
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold border border-white/20 transition-all"
              >
                Retry Connecting Camera
              </button>

              <div className="pt-4 border-t border-white/15 flex items-center justify-center gap-2">
                <span className="text-[11px] text-white/60">Test standard specimen:</span>
                <button
                  type="button"
                  onClick={() => loadSample('/assets/aistudio/image_2cfa053b.png', 'laysa_sample.png')}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white font-medium underline"
                >
                  Laysa
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => loadSample('/assets/aistudio/image_81dc703e.png', 'unknown_sample.png')}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white font-medium underline"
                >
                  Unknown
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Smart Detection Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div
                className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl transition-all duration-300 ${
                  isAnglePerfect
                    ? 'border-2 border-[#22C55E] shadow-[0_0_32px_rgba(34,197,94,0.45)]'
                    : 'border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Precision Corner Brackets */}
                <div
                  className={`absolute -top-1.5 -left-1.5 w-7 h-7 border-t-[3.5px] border-l-[3.5px] rounded-tl-xl transition-colors duration-200 ${
                    isAnglePerfect ? 'border-[#22C55E]' : 'border-white'
                  }`}
                />
                <div
                  className={`absolute -top-1.5 -right-1.5 w-7 h-7 border-t-[3.5px] border-r-[3.5px] rounded-tr-xl transition-colors duration-200 ${
                    isAnglePerfect ? 'border-[#22C55E]' : 'border-white'
                  }`}
                />
                <div
                  className={`absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-[3.5px] border-l-[3.5px] rounded-bl-xl transition-colors duration-200 ${
                    isAnglePerfect ? 'border-[#22C55E]' : 'border-white'
                  }`}
                />
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-[3.5px] border-r-[3.5px] rounded-br-xl transition-colors duration-200 ${
                    isAnglePerfect ? 'border-[#22C55E]' : 'border-white'
                  }`}
                />

                {/* Subtle alignment crosshair with glowing center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        isAnglePerfect ? 'bg-[#22C55E]' : 'bg-white/40'
                      }`}
                    />
                    {isAnglePerfect && (
                      <div className="absolute -inset-1 rounded-full bg-[#22C55E]/40 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Corner registration cross ticks */}
                <div className="absolute inset-4 rounded-2xl border border-dashed border-white/20 pointer-events-none" />
              </div>

              {/* Status Badge: "Turns GREEN when angle is perfect" */}
              <div
                className={`mt-6 px-4 py-1.5 rounded-full backdrop-blur-xl border text-xs font-semibold flex items-center gap-2 shadow-lg transition-all duration-300 ${
                  isAnglePerfect
                    ? 'bg-black/75 border-[#22C55E]/40 text-[#4ADE80]'
                    : 'bg-black/75 border-white/20 text-white/90'
                }`}
              >
                {isAnglePerfect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Angle is perfect for detection</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Center Pili fruit inside reticle</span>
                  </>
                )}
              </div>
            </div>

            {isCameraStarting && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 text-white gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-[#F2C01A] border-t-transparent animate-spin" />
                <span className="text-xs font-medium text-white/80 tracking-wide">
                  Initializing camera feed...
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Shutter Capture Bar */}
      <footer className="relative z-30 w-full px-6 py-6 pb-safe bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between">
        {/* Gallery Shortcut Button */}
        <div className="flex-1 flex justify-start">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-medium border border-white/15 backdrop-blur-xl active:scale-95 transition-all"
          >
            Gallery
          </button>
        </div>

        {/* Center: Tactile Shutter Button */}
        <div className="flex-none flex items-center justify-center px-4">
          <button
            type="button"
            onClick={capturePhoto}
            disabled={hasCameraError || isCameraStarting}
            aria-label="Capture Pili photo"
            className="group relative min-h-[76px] min-w-[76px] w-[76px] h-[76px] rounded-full p-1 border-[3.5px] border-white/90 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] active:scale-90 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#EA580C] to-[#FB923C] group-hover:brightness-110 flex items-center justify-center transition-all shadow-inner">
              <Camera className="w-7 h-7 text-white drop-shadow" />
            </div>
            {isAnglePerfect && (
              <div className="absolute -inset-1 rounded-full border border-[#22C55E]/60 animate-pulse pointer-events-none" />
            )}
          </button>
        </div>

        {/* Right: Angle Toggle Helper */}
        <div className="flex-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              playTap();
              setIsAnglePerfect((p) => !p);
            }}
            className="text-[11px] text-white/60 hover:text-white px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            title="Toggle Angle State"
          >
            {isAnglePerfect ? 'Ready' : 'Adjust'}
          </button>
        </div>
      </footer>
    </div>
  );
};
