import { GESTURE_TYPES, GESTURE_INFO } from './gestureClassifier';

/**
 * Temporal Gesture Smoother with Hysteresis
 * Prevents rapid flickering and requires stable gesture confirmation
 */
export class GestureSmoother {
  constructor(options = {}) {
    this.bufferSize = options.bufferSize || 6;
    this.confirmationThreshold = options.confirmationThreshold || 4; // At least 4 of 6 frames
    this.noHandGraceFrames = options.noHandGraceFrames || 4; // Frames to tolerate temporary drop

    this.frameBuffer = [];
    this.confirmedGesture = GESTURE_TYPES.NO_HAND;
    this.confirmedConfidence = 0;
    this.currentFingerStates = { thumb: false, index: false, middle: false, ring: false, pinky: false };
    this.currentMetrics = null;

    this.consecutiveSameCount = 0;
    this.noHandCount = 0;
    this.lastConfirmedTimestamp = 0;
  }

  /**
   * Process a new raw classification frame
   *
   * @param {Object} rawResult - Output from classifyGesture
   * @returns {Object} Smoothed gesture output and whether a change occurred
   */
  update(rawResult) {
    const rawGesture = rawResult?.gesture || GESTURE_TYPES.NO_HAND;
    const rawConf = rawResult?.confidence || 0;

    // Track no-hand condition with grace period
    if (rawGesture === GESTURE_TYPES.NO_HAND) {
      this.noHandCount++;
      if (this.noHandCount >= this.noHandGraceFrames) {
        const changed = this.confirmedGesture !== GESTURE_TYPES.NO_HAND;
        this.confirmedGesture = GESTURE_TYPES.NO_HAND;
        this.confirmedConfidence = 0;
        this.frameBuffer = [];
        this.currentFingerStates = { thumb: false, index: false, middle: false, ring: false, pinky: false };
        this.currentMetrics = null;

        return {
          gesture: GESTURE_TYPES.NO_HAND,
          ...GESTURE_INFO[GESTURE_TYPES.NO_HAND],
          confidence: 0,
          fingerStates: this.currentFingerStates,
          metrics: null,
          hasChanged: changed,
          isConfirmed: true
        };
      }
      // Within grace period, keep last confirmed gesture
      return {
        gesture: this.confirmedGesture,
        ...GESTURE_INFO[this.confirmedGesture],
        confidence: this.confirmedConfidence,
        fingerStates: this.currentFingerStates,
        metrics: this.currentMetrics,
        hasChanged: false,
        isConfirmed: true
      };
    }

    // Hand is present, reset no-hand counter
    this.noHandCount = 0;
    this.currentFingerStates = rawResult.fingerStates || this.currentFingerStates;
    this.currentMetrics = rawResult.metrics || this.currentMetrics;

    // Add to sliding window
    this.frameBuffer.push({
      gesture: rawGesture,
      confidence: rawConf
    });
    if (this.frameBuffer.length > this.bufferSize) {
      this.frameBuffer.shift();
    }

    // Count gesture frequencies in the window
    const counts = {};
    const confSum = {};
    for (const item of this.frameBuffer) {
      counts[item.gesture] = (counts[item.gesture] || 0) + 1;
      confSum[item.gesture] = (confSum[item.gesture] || 0) + item.confidence;
    }

    // Find dominant gesture
    let dominantGesture = rawGesture;
    let maxCount = 0;
    for (const [gest, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantGesture = gest;
      }
    }

    // Check if dominant gesture meets confirmation threshold
    const avgConfidence = maxCount > 0 ? (confSum[dominantGesture] / maxCount) : rawConf;
    let hasChanged = false;

    if (maxCount >= this.confirmationThreshold && dominantGesture !== GESTURE_TYPES.UNKNOWN) {
      if (this.confirmedGesture !== dominantGesture) {
        this.confirmedGesture = dominantGesture;
        this.confirmedConfidence = Math.round(avgConfidence * 100) / 100;
        hasChanged = true;
        this.lastConfirmedTimestamp = Date.now();
      } else {
        // Smoothly adjust confidence
        this.confirmedConfidence = Math.round((this.confirmedConfidence * 0.7 + avgConfidence * 0.3) * 100) / 100;
      }
    }

    return {
      gesture: this.confirmedGesture,
      ...GESTURE_INFO[this.confirmedGesture],
      confidence: this.confirmedConfidence || Math.round(rawConf * 100) / 100,
      fingerStates: this.currentFingerStates,
      metrics: this.currentMetrics,
      hasChanged,
      isConfirmed: this.confirmedGesture !== GESTURE_TYPES.UNKNOWN && this.confirmedGesture !== GESTURE_TYPES.NO_HAND
    };
  }

  reset() {
    this.frameBuffer = [];
    this.confirmedGesture = GESTURE_TYPES.NO_HAND;
    this.confirmedConfidence = 0;
    this.noHandCount = 0;
    this.currentMetrics = null;
  }
}
