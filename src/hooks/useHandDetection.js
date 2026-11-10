import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { classifyGesture, GESTURE_TYPES, GESTURE_INFO } from '../utils/gestureClassifier';
import { GestureSmoother } from '../utils/gestureSmoothing';
import { soundManager } from '../utils/soundEffects';

export function useHandDetection(videoRef, cameraStatus, isMirrored = true) {
  const [modelStatus, setModelStatus] = useState('uninitialized'); // uninitialized | loading | ready | error
  const [modelError, setModelError] = useState('');
  const [landmarks, setLandmarks] = useState(null);
  const [allHandsLandmarks, setAllHandsLandmarks] = useState([]);
  const [handCount, setHandCount] = useState(0);

  // Active gesture result
  const [currentGesture, setCurrentGesture] = useState({
    gesture: GESTURE_TYPES.NO_HAND,
    ...GESTURE_INFO[GESTURE_TYPES.NO_HAND],
    confidence: 0,
    fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    metrics: null
  });

  // Performance and Analytics
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  const [gestureCounts, setGestureCounts] = useState({
    [GESTURE_TYPES.OPEN_HAND]: 0,
    [GESTURE_TYPES.FIST]: 0,
    [GESTURE_TYPES.THUMBS_UP]: 0,
    [GESTURE_TYPES.VICTORY]: 0
  });
  const [history, setHistory] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Demo Simulation Mode
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Refs
  const landmarkerRef = useRef(null);
  const smootherRef = useRef(new GestureSmoother());
  const animationFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const fpsFramesRef = useRef([]);
  const lastDetectionTimeRef = useRef(0);
  const demoCycleRef = useRef({ gestureIdx: 0, lastSwitch: Date.now() });

  // 1. Initialize MediaPipe HandLandmarker
  useEffect(() => {
    let isCancelled = false;

    async function initModel() {
      setModelStatus('loading');
      setModelError('');

      try {
        // Try local wasm first, then fallback to CDN
        let vision;
        try {
          vision = await FilesetResolver.forVisionTasks('/wasm');
        } catch (localWasmErr) {
          console.warn('Local wasm load failed, trying jsdelivr CDN...', localWasmErr);
          vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm'
          );
        }

        if (isCancelled) return;

        // Try local model task file first, then fallback to Google storage
        let landmarker;
        try {
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/hand_landmarker.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
          });
        } catch (gpuErr) {
          console.warn('GPU delegate failed or local model error, attempting CPU / CDN fallback...', gpuErr);
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
          });
        }

        if (isCancelled) {
          landmarker?.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setModelStatus('ready');
      } catch (err) {
        console.error('Failed to initialize MediaPipe HandLandmarker:', err);
        if (!isCancelled) {
          setModelStatus('error');
          setModelError(err.message || 'Failed to load hand landmarker model.');
        }
      }
    }

    initModel();

    return () => {
      isCancelled = true;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  // 2. Track Session Timer when camera is active or demo is on
  useEffect(() => {
    let interval = null;
    if (cameraStatus === 'active' || isDemoMode) {
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      setSessionStartTime(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraStatus, isDemoMode, sessionStartTime]);

  // 3. Clear History helper
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // 4. Synthetic Demo Hand generator
  const generateDemoHand = useCallback((timestamp) => {
    const now = Date.now();
    const demoGestures = [
      GESTURE_TYPES.OPEN_HAND,
      GESTURE_TYPES.VICTORY,
      GESTURE_TYPES.THUMBS_UP,
      GESTURE_TYPES.FIST
    ];

    if (now - demoCycleRef.current.lastSwitch > 3500) {
      demoCycleRef.current.gestureIdx = (demoCycleRef.current.gestureIdx + 1) % demoGestures.length;
      demoCycleRef.current.lastSwitch = now;
    }

    const currentTarget = demoGestures[demoCycleRef.current.gestureIdx];
    const wobbleX = Math.sin(timestamp * 0.002) * 0.02;
    const wobbleY = Math.cos(timestamp * 0.0015) * 0.02;

    const baseHand = [
      { x: 0.5 + wobbleX, y: 0.75 + wobbleY, z: 0 }, // 0: WRIST
      // Thumb
      { x: 0.44 + wobbleX, y: 0.70 + wobbleY, z: -0.01 },
      { x: 0.40 + wobbleX, y: 0.63 + wobbleY, z: -0.02 },
      { x: 0.38 + wobbleX, y: 0.55 + wobbleY, z: -0.03 },
      { x: 0.36 + wobbleX, y: 0.48 + wobbleY, z: -0.04 }, // 4: TIP
      // Index
      { x: 0.46 + wobbleX, y: 0.52 + wobbleY, z: -0.01 },
      { x: 0.45 + wobbleX, y: 0.44 + wobbleY, z: -0.02 },
      { x: 0.44 + wobbleX, y: 0.36 + wobbleY, z: -0.03 },
      { x: 0.43 + wobbleX, y: 0.28 + wobbleY, z: -0.04 }, // 8: TIP
      // Middle
      { x: 0.50 + wobbleX, y: 0.50 + wobbleY, z: 0 },
      { x: 0.50 + wobbleX, y: 0.42 + wobbleY, z: -0.01 },
      { x: 0.50 + wobbleX, y: 0.34 + wobbleY, z: -0.02 },
      { x: 0.50 + wobbleX, y: 0.25 + wobbleY, z: -0.03 }, // 12: TIP
      // Ring
      { x: 0.54 + wobbleX, y: 0.52 + wobbleY, z: 0.01 },
      { x: 0.55 + wobbleX, y: 0.45 + wobbleY, z: 0.00 },
      { x: 0.56 + wobbleX, y: 0.37 + wobbleY, z: -0.01 },
      { x: 0.57 + wobbleX, y: 0.30 + wobbleY, z: -0.02 }, // 16: TIP
      // Pinky
      { x: 0.58 + wobbleX, y: 0.55 + wobbleY, z: 0.02 },
      { x: 0.60 + wobbleX, y: 0.49 + wobbleY, z: 0.01 },
      { x: 0.61 + wobbleX, y: 0.43 + wobbleY, z: 0.00 },
      { x: 0.62 + wobbleX, y: 0.37 + wobbleY, z: -0.01 }, // 20: TIP
    ];

    // Morph coordinates depending on target gesture
    if (currentTarget === GESTURE_TYPES.FIST) {
      // Fold all fingertips close to MCPs
      baseHand[4] = { x: 0.45 + wobbleX, y: 0.58 + wobbleY, z: 0.02 };
      baseHand[8] = { x: 0.46 + wobbleX, y: 0.56 + wobbleY, z: 0.02 };
      baseHand[12] = { x: 0.50 + wobbleX, y: 0.55 + wobbleY, z: 0.02 };
      baseHand[16] = { x: 0.54 + wobbleX, y: 0.56 + wobbleY, z: 0.02 };
      baseHand[20] = { x: 0.58 + wobbleX, y: 0.58 + wobbleY, z: 0.02 };
    } else if (currentTarget === GESTURE_TYPES.THUMBS_UP) {
      // Thumb extended straight up
      baseHand[1] = { x: 0.46 + wobbleX, y: 0.68 + wobbleY, z: -0.01 };
      baseHand[2] = { x: 0.44 + wobbleX, y: 0.58 + wobbleY, z: -0.02 };
      baseHand[3] = { x: 0.44 + wobbleX, y: 0.47 + wobbleY, z: -0.03 };
      baseHand[4] = { x: 0.44 + wobbleX, y: 0.32 + wobbleY, z: -0.05 }; // Tip pointing UP!
      // Other 4 fingers folded
      baseHand[8] = { x: 0.47 + wobbleX, y: 0.56 + wobbleY, z: 0.02 };
      baseHand[12] = { x: 0.51 + wobbleX, y: 0.55 + wobbleY, z: 0.02 };
      baseHand[16] = { x: 0.55 + wobbleX, y: 0.56 + wobbleY, z: 0.02 };
      baseHand[20] = { x: 0.59 + wobbleX, y: 0.58 + wobbleY, z: 0.02 };
    } else if (currentTarget === GESTURE_TYPES.VICTORY) {
      // Index & Middle spread apart, Ring & Pinky folded, Thumb tucked
      baseHand[4] = { x: 0.47 + wobbleX, y: 0.60 + wobbleY, z: 0.02 };
      baseHand[8] = { x: 0.41 + wobbleX, y: 0.26 + wobbleY, z: -0.04 }; // Spread left
      baseHand[12] = { x: 0.53 + wobbleX, y: 0.25 + wobbleY, z: -0.03 }; // Spread right
      baseHand[16] = { x: 0.54 + wobbleX, y: 0.56 + wobbleY, z: 0.02 };
      baseHand[20] = { x: 0.58 + wobbleX, y: 0.58 + wobbleY, z: 0.02 };
    }

    return baseHand;
  }, []);

  // 5. Detection Processing Loop
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const startTime = performance.now();

    let detectedLandmarks = null;
    let allDetected = [];
    let detectedHandCount = 0;
    let handedness = 'Right';

    if (isDemoMode) {
      // Run in demo simulation
      const demoHand = generateDemoHand(startTime);
      detectedLandmarks = demoHand;
      allDetected = [demoHand];
      detectedHandCount = 1;
    } else if (landmarker && video && cameraStatus === 'active') {
      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        try {
          const results = landmarker.detectForVideo(video, startTime);
          if (results.landmarks && results.landmarks.length > 0) {
            detectedLandmarks = results.landmarks[0];
            allDetected = results.landmarks;
            detectedHandCount = results.landmarks.length;
            if (results.handednesses && results.handednesses[0]?.[0]) {
              handedness = results.handednesses[0][0].displayName || 'Right';
            }
          }
        } catch (err) {
          console.warn('Inference error in frame:', err);
        }
      }
    }

    // Set landmark states for canvas rendering
    setLandmarks(detectedLandmarks);
    setAllHandsLandmarks(allDetected);
    setHandCount(detectedHandCount);

    // Run geometric classification
    const rawResult = classifyGesture(detectedLandmarks, handedness);

    // Apply temporal smoothing with hysteresis
    const smoothed = smootherRef.current.update(rawResult);
    setCurrentGesture(smoothed);

    // Handle new confirmed gesture event
    if (smoothed.hasChanged && smoothed.isConfirmed) {
      soundManager.playGestureConfirmed(smoothed.gesture);

      // Increment analytics counter
      setTotalDetections(prev => prev + 1);
      setGestureCounts(prev => ({
        ...prev,
        [smoothed.gesture]: (prev[smoothed.gesture] || 0) + 1
      }));

      // Add to recognition history (capped at 50 to prevent memory leak)
      const historyItem = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        gesture: smoothed.gesture,
        name: smoothed.name,
        emoji: smoothed.emoji,
        icon: smoothed.icon,
        confidence: smoothed.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        color: smoothed.color
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    }

    // Compute FPS & Latency
    const endTime = performance.now();
    const frameLatency = Math.round(endTime - startTime);
    setLatency(frameLatency);

    fpsFramesRef.current.push(startTime);
    // Keep only timestamps within last 1000ms
    const oneSecAgo = startTime - 1000;
    fpsFramesRef.current = fpsFramesRef.current.filter(t => t > oneSecAgo);
    setFps(fpsFramesRef.current.length);

    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [cameraStatus, isDemoMode, generateDemoHand, videoRef]);

  // Start / Stop the processing loop
  useEffect(() => {
    if (modelStatus === 'ready' && (cameraStatus === 'active' || isDemoMode)) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setLandmarks(null);
      setAllHandsLandmarks([]);
      setHandCount(0);
      smootherRef.current.reset();
      setCurrentGesture({
        gesture: GESTURE_TYPES.NO_HAND,
        ...GESTURE_INFO[GESTURE_TYPES.NO_HAND],
        confidence: 0,
        fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
        metrics: null
      });
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [modelStatus, cameraStatus, isDemoMode, processFrame]);

  return {
    modelStatus,
    modelError,
    landmarks,
    allHandsLandmarks,
    handCount,
    currentGesture,
    fps,
    latency,
    totalDetections,
    gestureCounts,
    history,
    sessionDuration,
    clearHistory,
    isDemoMode,
    setIsDemoMode
  };
}
