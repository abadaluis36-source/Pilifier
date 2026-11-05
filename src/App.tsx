import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SourceSelectionScreen } from './components/SourceSelectionScreen';
import { CameraScreen } from './components/CameraScreen';
import { ImagePreview } from './components/ImagePreview';
import { ClassificationLoading } from './components/ClassificationLoading';
import { ResultScreen } from './components/ResultScreen';
import { UserGuideModal } from './components/UserGuideModal';
import {
  ClassificationResult,
  defaultClassifier,
  SAMPLE_PREVIEWS,
} from './services/classification';
import { Code2, ChevronRight, X } from 'lucide-react';

type Step = 'welcome' | 'source_select' | 'camera' | 'preview' | 'loading' | 'result';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);

  // User's Guide Modal state
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Cursor Integration information modal
  const [showCursorModal, setShowCursorModal] = useState(false);

  // Transition: Image Selected (from camera or gallery)
  const handleImageSelected = (file: File, url: string) => {
    setCapturedFile(file);
    setPreviewUrl(url);
    setCurrentStep('preview');

    // Warm up the TFLite runtime/model while the user reviews the photo so
    // pressing "Identify" does not have to download everything from scratch.
    void defaultClassifier.preload();
  };

  // Transition: Retake / Go back from preview
  const handleRetake = () => {
    setCapturedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCurrentStep('camera');
  };

  // Transition: Identify Image
  const handleIdentify = async () => {
    if (!capturedFile) return;

    setCurrentStep('loading');

    // Keep the scan animation visible briefly, but run it in parallel with
    // inference instead of adding a fixed delay on top of it.
    const minimumScanTime = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const [result] = await Promise.all([
        defaultClassifier.classifyImage(capturedFile),
        minimumScanTime,
      ]);
      setClassificationResult(result as ClassificationResult);
      setCurrentStep('result');
    } catch (err: any) {
      console.error('Classification failed:', err.message);
      // Alert the user or handle error state
      alert(`Classification error: ${err.message}`);
      setCurrentStep('preview');
    }
  };

  // Switch variety state in ResultScreen
  const handleSelectSampleVariety = (varietyKey: 'laysa' | 'lanuza' | 'unknownVariety' | 'unknownObject') => {
    const sample = SAMPLE_PREVIEWS[varietyKey];
    if (sample) {
      setClassificationResult(sample);
      if (varietyKey === 'unknownVariety') {
        setPreviewUrl('/assets/aistudio/image_81dc703e.png');
      } else if (varietyKey === 'laysa') {
        setPreviewUrl('/assets/aistudio/image_2cfa053b.png');
      } else if (varietyKey === 'lanuza') {
        setPreviewUrl('/assets/aistudio/image_df96da38.png');
      }
    }
  };

  // Reset to live camera
  const handleScanAgain = () => {
    setCapturedFile(null);
    setCurrentStep('camera');
  };

  // Back to source selection
  const handleBackToSource = () => {
    setCapturedFile(null);
    setCurrentStep('source_select');
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#121814] flex items-center justify-center overflow-x-hidden font-sans">
      {/* Container: Fullscreen on mobile, phone frame on desktop */}
      <div className="relative w-full max-w-md h-[100dvh] bg-[#162119] sm:shadow-2xl sm:rounded-3xl sm:border border-white/10 flex flex-col overflow-hidden">
        {/* Step 1: Welcome Screen (image_565fc6e8.png) */}
        {currentStep === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setCurrentStep('source_select')}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* Step 2: Choose Image Source Screen (image_bce6cbd4.png) */}
        {currentStep === 'source_select' && (
          <SourceSelectionScreen
            onBack={() => setCurrentStep('welcome')}
            onOpenLiveCamera={() => setCurrentStep('camera')}
            onImageSelected={handleImageSelected}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* Step 3: Live Camera Screen (with green alignment indicator) */}
        {currentStep === 'camera' && (
          <CameraScreen
            onBack={() => setCurrentStep('source_select')}
            onImageCaptured={handleImageSelected}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* Step 4: Confirm Photo Screen */}
        {currentStep === 'preview' && capturedFile && previewUrl && (
          <ImagePreview
            imageFile={capturedFile}
            previewUrl={previewUrl}
            onRetake={handleRetake}
            onIdentify={handleIdentify}
            onUploadDifferent={() => setCurrentStep('source_select')}
          />
        )}

        {/* Step 5: Classification Loading */}
        {currentStep === 'loading' && previewUrl && (
          <ClassificationLoading previewUrl={previewUrl} />
        )}

        {/* Step 6: Classification Result (image_81dc703e.png & image_2cfa053b.png) */}
        {currentStep === 'result' && classificationResult && (
          <ResultScreen
            result={classificationResult}
            previewUrl={previewUrl || '/assets/aistudio/image_2cfa053b.png'}
            onScanAgain={handleScanAgain}
            onBackToSource={handleBackToSource}
            onSelectSampleVariety={handleSelectSampleVariety}
          />
        )}

        {/* User's Guide Modal (image_3f1c8bdb.png) */}
        <UserGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* Cursor TFLite info drawer/modal */}
        {showCursorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-[#1e2420] text-white rounded-3xl p-5 border border-white/15 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowCursorModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                <Code2 className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">
                  Cursor TFLite Integration Ready
                </h3>
              </div>

              <p className="text-xs text-white/70 leading-relaxed mb-4">
                The service <code className="text-emerald-400 font-mono">ClassificationService</code> in <span className="text-white font-mono font-semibold">src/services/classification.ts</span> is set up for Cursor to plug in your MobileNetV2 .tflite weights.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectSampleVariety('laysa');
                    setShowCursorModal(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-between"
                >
                  <span>Preview Laysa Variety</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectSampleVariety('unknownVariety');
                    setShowCursorModal(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-between"
                >
                  <span>Preview Unknown Variety</span>
                  <ChevronRight className="w-4 h-4 text-[#F2C01A]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
