/**
 * PILIFIER Classification Service Contract & Botanical Database
 * 
 * READY FOR TENSORFLOW LITE MODEL INTEGRATION:
 * This module is fully prepared to receive your MobileNetV2 .tflite model.
 * 
 * If you have your trained model:
 * 1. You can paste the code / model handler directly into this chat!
 * 2. Or place your .tflite file in `public/models/pili_mobilenetv2.tflite`
 * 3. `preprocessImageForMobileNet` is already implemented below to convert
 *    any image File into the [224, 224, 3] Float32 tensor.
 * 4. `createClassificationResultFromProbabilities` automatically formats the
 *    output tensor into the exact result screen data.
 */

import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';

// Set WASM path for TFLite
tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.10/dist/');

export interface Prediction {
  label: string;
  index: number;
  confidence: number;
}

export interface VarietyDetail {
  officialLabel: string;
  scientificName: string;
  cultivarCode?: string;
  statusTag: string;
  aboutTitle: string;
  aboutProse: string;
  identifyingCharacteristics: {
    label: string;
    value: string;
  }[];
}

export interface ClassificationResult {
  selectedLabel: string;
  confidence: number;
  predictions: Prediction[];
  details?: VarietyDetail;
}

export interface ClassificationService {
  classifyImage(file: File): Promise<ClassificationResult>;
}

/**
 * Standard classes supported by the PILIFIER MobileNetV2 Pili Classifier
 */
export const PILI_CLASSES = [
  'Lanuza Variety',
  'Laysa Variety',
  'Unknown Variety',
  'Unknown Object'
] as const;

export type PiliClassLabel = (typeof PILI_CLASSES)[number] | string;

/**
 * Verified botanical and Philippine agricultural registry specifications
 * matching the exact user prompt.
 */
export const VARIETY_DATABASE: Record<string, VarietyDetail> = {
  'Lanuza Variety': {
    officialLabel: 'Lanuza Variety',
    scientificName: 'Canarium ovatum Engl.',
    cultivarCode: 'NSIC 2000-PI-04',
    statusTag: 'PREDICTED VARIETY',
    aboutTitle: 'About Lanuza',
    aboutProse:
      'Lanuza is a registered Pili variety (Canarium ovatum Engl.) recognized for its relatively large fruits and spreading tree canopy. It is a high-yielding variety that can produce fruits throughout the year. The tree is reported to reach approximately 7 meters in height after 19 years of growth. Its fruits have a short oblong shape, with a dark purple to nearly black outer pulp when mature. Inside the hard shell is a creamy white kernel, which is an important part of the Pili fruit used in food products and confectionery.',
    identifyingCharacteristics: [
      { label: 'Fruit shape', value: 'Short oblong' },
      { label: 'Pulp color', value: 'Dark purple to black' },
      { label: 'Kernel color', value: 'Creamy white' },
      { label: 'Tree canopy', value: 'Spreading' },
      { label: 'Tree height', value: 'Approximately 7 meters after 19 years' },
      { label: 'Reported average fruit weight', value: '36.52 g' },
    ],
  },
  'Laysa Variety': {
    officialLabel: 'Laysa Variety',
    scientificName: 'Canarium ovatum Engl.',
    cultivarCode: 'NSIC 1999-PI-03',
    statusTag: 'PREDICTED VARIETY',
    aboutTitle: 'About Laysa',
    aboutProse:
      'Laysa is a registered Pili variety (Canarium ovatum Engl.) known for its relatively large fruits, spreading tree canopy, and high-yielding characteristics. It is native to Mayon Crossing, Tabaco, Albay, and is recognized for its ability to produce fruits throughout the year. The tree is reported to reach approximately 10 meters in height after 16 years of growth. Laysa is also considered easy to propagate asexually, making it a useful variety for Pili cultivation. Its fruit contains a hard shell enclosing an edible kernel, which is described in Philippine standards as elliptical in shape and creamy white in color.',
    identifyingCharacteristics: [
      { label: 'Fruit shape', value: 'Refer to verified variety-specific fruit measurements before specifying' },
      { label: 'Tree canopy', value: 'Spreading' },
      { label: 'Tree height', value: 'Approximately 10 meters after 16 years' },
      { label: 'Reported average fruit weight', value: '33.6 g' },
      { label: 'Kernel shape', value: 'Elliptical' },
      { label: 'Kernel color', value: 'Creamy white' },
      { label: 'Reported kernel weight', value: '2.57 g' },
      { label: 'Fruiting', value: 'Bears fruit throughout the year' },
    ],
  },
  'Unknown Variety': {
    officialLabel: 'Unknown Variety',
    scientificName: 'Canarium ovatum Engl. (Unregistered)',
    statusTag: 'PREDICTED VARIETY',
    aboutTitle: 'About Unknown Variety',
    aboutProse:
      'This Pili fruit is still under field observation and has not been fully verified or officially registered. Some local varieties are not yet included in the system\'s database, so the app may classify them as unknown until further validation and dataset updates are completed.',
    identifyingCharacteristics: [
      { label: 'Observation status', value: 'Field evaluation in progress' },
      { label: 'Recommended action', value: 'Retake with better lighting or submit specimen to DA-RFO' },
      { label: 'Database inclusion', value: 'Queued for retraining update' },
    ],
  },
  'Unknown Object': {
    officialLabel: 'Unknown Object',
    scientificName: 'Non-Pili Specimen',
    statusTag: 'PREDICTED VARIETY',
    aboutTitle: 'About Detection',
    aboutProse:
      'The detected subject does not exhibit characteristic Pili fruit morphology or features. Please ensure the camera is focused directly on a single Pili fruit under good lighting.',
    identifyingCharacteristics: [
      { label: 'Detection type', value: 'Non-botanical or unsupported object' },
      { label: 'Guidance', value: 'Center a single Pili fruit in the green guide box' },
    ],
  },
};

/**
 * Standard preview outputs matching the user's exact values
 */
export const SAMPLE_PREVIEWS: Record<string, ClassificationResult> = {
  lanuza: {
    selectedLabel: 'Lanuza Variety',
    confidence: 0.925, // 92.5%
    predictions: [
      { label: 'Lanuza Variety', index: 0, confidence: 0.925 },
      { label: 'Laysa Variety', index: 1, confidence: 0.052 },
      { label: 'Unknown Variety', index: 2, confidence: 0.023 },
    ],
    details: VARIETY_DATABASE['Lanuza Variety'],
  },
  laysa: {
    selectedLabel: 'Laysa Variety',
    confidence: 0.942, // 94.2%
    predictions: [
      { label: 'Laysa Variety', index: 1, confidence: 0.942 },
      { label: 'Lanuza Variety', index: 0, confidence: 0.045 },
      { label: 'Unknown Variety', index: 2, confidence: 0.013 },
    ],
    details: VARIETY_DATABASE['Laysa Variety'],
  },
  unknownVariety: {
    selectedLabel: 'Unknown Variety',
    confidence: 0.848,
    predictions: [
      { label: 'Unknown Variety', index: 2, confidence: 0.848 },
      { label: 'Lanuza Variety', index: 0, confidence: 0.092 },
      { label: 'Laysa Variety', index: 1, confidence: 0.060 },
    ],
    details: VARIETY_DATABASE['Unknown Variety'],
  },
  unknownObject: {
    selectedLabel: 'Unknown Object',
    confidence: 0.914,
    predictions: [
      { label: 'Unknown Object', index: 3, confidence: 0.914 },
      { label: 'Unknown Variety', index: 2, confidence: 0.052 },
      { label: 'Laysa Variety', index: 1, confidence: 0.034 },
    ],
    details: VARIETY_DATABASE['Unknown Object'],
  },
};

/**
 * Preprocess any Image File into MobileNetV2 input Float32Array [224, 224, 3]
 * Ready for TensorFlow Lite Web inference.
 */
export async function preprocessImageForMobileNet(
  file: File,
  targetWidth = 224,
  targetHeight = 224,
  normalizeTo: 'zeroToOne' | 'minusOneToOne' = 'minusOneToOne'
): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const { data } = imageData;

      const numPixels = targetWidth * targetHeight;
      const floatArray = new Float32Array(numPixels * 3);

      for (let i = 0; i < numPixels; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];

        if (normalizeTo === 'minusOneToOne') {
          // MobileNetV2 standard: (pixel / 127.5) - 1.0
          floatArray[i * 3] = r / 127.5 - 1.0;
          floatArray[i * 3 + 1] = g / 127.5 - 1.0;
          floatArray[i * 3 + 2] = b / 127.5 - 1.0;
        } else {
          // [0, 1] normalization: pixel / 255.0
          floatArray[i * 3] = r / 255.0;
          floatArray[i * 3 + 1] = g / 255.0;
          floatArray[i * 3 + 2] = b / 255.0;
        }
      }
      resolve(floatArray);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Helper to transform model output probabilities into the complete Result structure
 * with full botanical details and ranked predictions.
 */
export function createClassificationResultFromProbabilities(
  probabilities: number[] | Float32Array,
  classLabels: readonly string[] = PILI_CLASSES
): ClassificationResult {
  const predictions: Prediction[] = Array.from(probabilities).map((conf, index) => ({
    label: classLabels[index] || `Class ${index}`,
    index,
    confidence: conf,
  }));

  // Sort descending by confidence
  const sorted = [...predictions].sort((a, b) => b.confidence - a.confidence);
  const best = sorted[0];

  return {
    selectedLabel: best.label,
    confidence: best.confidence,
    predictions: sorted,
    details: VARIETY_DATABASE[best.label] || {
      officialLabel: best.label,
      scientificName: 'Canarium ovatum Engl.',
      statusTag: 'PREDICTED VARIETY',
      aboutTitle: `About ${best.label}`,
      aboutProse: 'Analyzed Pili fruit classification.',
      identifyingCharacteristics: [],
    },
  };
}

/**
 * Default production service stub awaiting TensorFlow Lite model integration.
 */
export class TFLiteClassificationService implements ClassificationService {
  private model: tflite.TFLiteModel | null = null;
  private readonly MODEL_URL = '/model_unquant.tflite';

  /**
   * Loads the TFLite model if not already loaded.
   */
  private async ensureModelLoaded() {
    if (!this.model) {
      try {
        this.model = await tflite.loadTFLiteModel(this.MODEL_URL);
      } catch (error) {
        console.error('Failed to load TFLite model:', error);
        throw new Error('MODEL_LOAD_FAILED: Ensure model_unquant.tflite is in the public folder.');
      }
    }
  }

  /**
   * Classify an image file using MobileNetV2 TensorFlow Lite.
   */
  async classifyImage(file: File): Promise<ClassificationResult> {
    try {
      await this.ensureModelLoaded();
      if (!this.model) throw new Error('Model initialization failed');

      // 1. Preprocess the image to [224, 224, 3] Float32 tensor
      const inputData = await preprocessImageForMobileNet(file);
      const inputTensor = tf.tensor(inputData, [1, 224, 224, 3]);

      // 2. Run inference
      const outputTensor = this.model.predict(inputTensor) as tf.Tensor;
      const probabilities = await outputTensor.data();

      // 3. Cleanup tensors
      inputTensor.dispose();
      outputTensor.dispose();

      // 4. Map probabilities to classification result
      return createClassificationResultFromProbabilities(Array.from(probabilities));
    } catch (err: any) {
      console.error('Classification error:', err);
      throw err;
    }
  }
}

// Singleton instance ready for app injection
export const defaultClassifier = new TFLiteClassificationService();
