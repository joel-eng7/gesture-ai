import { distance2D, calculateAngle, getHandScale } from './landmarkUtils';

/**
 * Supported Gesture Types
 */
export const GESTURE_TYPES = {
  OPEN_HAND: 'OPEN_HAND',
  FIST: 'FIST',
  THUMBS_UP: 'THUMBS_UP',
  VICTORY: 'VICTORY',
  UNKNOWN: 'UNKNOWN',
  NO_HAND: 'NO_HAND'
};

export const GESTURE_INFO = {
  [GESTURE_TYPES.OPEN_HAND]: {
    id: GESTURE_TYPES.OPEN_HAND,
    name: 'Open Hand',
    description: 'All 5 fingers extended outward with an open palm.',
    icon: 'Hand',
    emoji: '🖐️',
    color: '#1677FF',
    accent: '#55D6FF',
    fingerStates: { thumb: true, index: true, middle: true, ring: true, pinky: true }
  },
  [GESTURE_TYPES.FIST]: {
    id: GESTURE_TYPES.FIST,
    name: 'Fist',
    description: 'All fingers folded into the palm, forming a closed fist.',
    icon: 'Fist',
    emoji: '✊',
    color: '#258BFF',
    accent: '#1677FF',
    fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false }
  },
  [GESTURE_TYPES.THUMBS_UP]: {
    id: GESTURE_TYPES.THUMBS_UP,
    name: 'Thumbs Up',
    description: 'Thumb pointing upward while the other 4 fingers remain tightly folded.',
    icon: 'ThumbsUp',
    emoji: '👍',
    color: '#00D1FF',
    accent: '#258BFF',
    fingerStates: { thumb: true, index: false, middle: false, ring: false, pinky: false }
  },
  [GESTURE_TYPES.VICTORY]: {
    id: GESTURE_TYPES.VICTORY,
    name: 'Victory / Peace',
    description: 'Index and middle fingers extended in a V shape, other fingers folded.',
    icon: 'Peace',
    emoji: '✌️',
    color: '#38BDF8',
    accent: '#1677FF',
    fingerStates: { thumb: false, index: true, middle: true, ring: false, pinky: false }
  },
  [GESTURE_TYPES.UNKNOWN]: {
    id: GESTURE_TYPES.UNKNOWN,
    name: 'Transitioning / Unknown',
    description: 'Hand detected, but pose does not match one of the 4 defined gestures.',
    icon: 'HelpCircle',
    emoji: '❓',
    color: '#94A3B8',
    accent: '#CBD5E1',
    fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false }
  },
  [GESTURE_TYPES.NO_HAND]: {
    id: GESTURE_TYPES.NO_HAND,
    name: 'No Hand Detected',
    description: 'Place your hand clearly within the camera frame.',
    icon: 'Scan',
    emoji: '👁️',
    color: '#64748B',
    accent: '#94A3B8',
    fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false }
  }
};

/**
 * Analyze finger extension states and geometry
 */
export function analyzeFingers(landmarks, handedness = 'Right') {
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  const wrist = landmarks[0];
  const handScale = getHandScale(landmarks);

  // Helper for normal 4 fingers (Index, Middle, Ring, Pinky)
  // MCP -> PIP -> DIP -> TIP
  const checkFinger = (mcpIdx, pipIdx, dipIdx, tipIdx) => {
    const mcp = landmarks[mcpIdx];
    const pip = landmarks[pipIdx];
    const dip = landmarks[dipIdx];
    const tip = landmarks[tipIdx];

    const dWristTip = distance2D(wrist, tip);
    const dWristPip = distance2D(wrist, pip);
    const dMcpTip = distance2D(mcp, tip);
    const dMcpPip = distance2D(mcp, pip);

    // Angle at PIP joint (degree between MCP-PIP and TIP-PIP)
    const anglePip = calculateAngle(mcp, pip, tip);

    // Straightness ratio: ratio of wrist-to-tip vs wrist-to-pip
    const extensionRatio = dWristTip / (dWristPip || 0.001);

    // A finger is extended if tip is far beyond PIP and the angle at PIP is straight
    const isExtended = extensionRatio > 1.20 && anglePip > 135 && dMcpTip > dMcpPip;

    // A finger is folded if tip is curled toward palm (near or below PIP)
    const isFolded = extensionRatio < 1.05 || anglePip < 115 || dMcpTip < dMcpPip * 0.95;

    // Quality score of extension (0.0 to 1.0)
    const extensionScore = Math.max(0, Math.min(1, (extensionRatio - 1.0) / 0.5));
    // Quality score of fold (0.0 to 1.0)
    const foldScore = Math.max(0, Math.min(1, (1.25 - extensionRatio) / 0.4));

    return {
      isExtended,
      isFolded,
      extensionRatio,
      anglePip,
      extensionScore,
      foldScore
    };
  };

  const index = checkFinger(5, 6, 7, 8);
  const middle = checkFinger(9, 10, 11, 12);
  const ring = checkFinger(13, 14, 15, 16);
  const pinky = checkFinger(17, 18, 19, 20);

  // Special kinematic analysis for Thumb:
  // CMC (1) -> MCP (2) -> IP (3) -> TIP (4)
  const thumbCmc = landmarks[1];
  const thumbMcp = landmarks[2];
  const thumbIp = landmarks[3];
  const thumbTip = landmarks[4];
  const indexMcp = landmarks[5];

  const dThumbWristTip = distance2D(wrist, thumbTip);
  const dThumbWristMcp = distance2D(wrist, thumbMcp);
  const dThumbTipIndexMcp = distance2D(thumbTip, indexMcp);

  // Thumb angle at MCP/IP
  const thumbAngle = calculateAngle(thumbCmc, thumbMcp, thumbTip);

  // Thumb extension: distance from index MCP and wrist
  const thumbSeparation = dThumbTipIndexMcp / handScale;
  const isThumbExtended = thumbSeparation > 0.65 || (dThumbWristTip / dThumbWristMcp > 1.35 && thumbAngle > 130);
  const isThumbFolded = thumbSeparation < 0.45;

  const thumbExtensionScore = Math.max(0, Math.min(1, (thumbSeparation - 0.4) / 0.4));
  const thumbFoldScore = Math.max(0, Math.min(1, (0.7 - thumbSeparation) / 0.35));

  // Thumbs Up upward orientation check:
  // In screen space (y down = positive), tip must be significantly above IP, MCP, and wrist
  // tip.y < ip.y < mcp.y < wrist.y
  const dyTipToIp = thumbIp.y - thumbTip.y; // Positive if tip is above IP
  const dyTipToWrist = wrist.y - thumbTip.y; // Positive if tip is above wrist
  const thumbUpwardAlignment = dyTipToWrist / handScale;

  const isThumbUpward = dyTipToIp > 0.05 * handScale && thumbUpwardAlignment > 0.4;

  return {
    handScale,
    handedness,
    thumb: {
      isExtended: isThumbExtended,
      isFolded: isThumbFolded,
      isUpward: isThumbUpward,
      upwardScore: Math.max(0, Math.min(1, (thumbUpwardAlignment - 0.25) / 0.5)),
      extensionScore: thumbExtensionScore,
      foldScore: thumbFoldScore,
      separation: thumbSeparation
    },
    index,
    middle,
    ring,
    pinky,
    // Separation between Index and Middle tips for Victory (Peace) V-sign
    indexMiddleSpread: distance2D(landmarks[8], landmarks[12]) / handScale
  };
}

/**
 * Classify hand gesture based on geometric landmarks
 *
 * @param {Array} landmarks - 21 MediaPipe hand landmarks
 * @param {string} handedness - 'Right' or 'Left'
 * @returns {Object} Classified gesture result with confidence and metrics
 */
export function classifyGesture(landmarks, handedness = 'Right') {
  if (!landmarks || landmarks.length < 21) {
    return {
      gesture: GESTURE_TYPES.NO_HAND,
      ...GESTURE_INFO[GESTURE_TYPES.NO_HAND],
      confidence: 0,
      fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
      metrics: null
    };
  }

  const analysis = analyzeFingers(landmarks, handedness);
  if (!analysis) {
    return {
      gesture: GESTURE_TYPES.UNKNOWN,
      ...GESTURE_INFO[GESTURE_TYPES.UNKNOWN],
      confidence: 0,
      fingerStates: { thumb: false, index: false, middle: false, ring: false, pinky: false },
      metrics: null
    };
  }

  const { thumb, index, middle, ring, pinky, indexMiddleSpread } = analysis;

  const fingerStates = {
    thumb: thumb.isExtended,
    index: index.isExtended,
    middle: middle.isExtended,
    ring: ring.isExtended,
    pinky: pinky.isExtended
  };

  // Evaluate GESTURE 1 — OPEN HAND
  // All 5 extended
  const openHandScore = (
    thumb.extensionScore * 0.2 +
    index.extensionScore * 0.2 +
    middle.extensionScore * 0.2 +
    ring.extensionScore * 0.2 +
    pinky.extensionScore * 0.2
  );
  const isOpenHand = (
    (thumb.isExtended || thumb.separation > 0.55) &&
    index.isExtended &&
    middle.isExtended &&
    ring.isExtended &&
    pinky.isExtended
  );

  // Evaluate GESTURE 2 — FIST
  // All 4 fingers folded, thumb folded or tucked
  const fistScore = (
    thumb.foldScore * 0.2 +
    index.foldScore * 0.2 +
    middle.foldScore * 0.2 +
    ring.foldScore * 0.2 +
    pinky.foldScore * 0.2
  );
  const isFist = (
    index.isFolded &&
    middle.isFolded &&
    ring.isFolded &&
    pinky.isFolded &&
    !thumb.isUpward
  );

  // Evaluate GESTURE 3 — THUMBS UP
  // Thumb extended upward, other 4 fingers folded
  const thumbsUpScore = (
    thumb.upwardScore * 0.4 +
    index.foldScore * 0.15 +
    middle.foldScore * 0.15 +
    ring.foldScore * 0.15 +
    pinky.foldScore * 0.15
  );
  const isThumbsUp = (
    thumb.isUpward &&
    index.isFolded &&
    middle.isFolded &&
    ring.isFolded &&
    pinky.isFolded
  );

  // Evaluate GESTURE 4 — VICTORY / PEACE
  // Index & Middle extended, Ring & Pinky folded, spread between Index & Middle
  const spreadScore = Math.max(0, Math.min(1, (indexMiddleSpread - 0.25) / 0.35));
  const victoryScore = (
    index.extensionScore * 0.25 +
    middle.extensionScore * 0.25 +
    ring.foldScore * 0.2 +
    pinky.foldScore * 0.2 +
    spreadScore * 0.1
  );
  const isVictory = (
    index.isExtended &&
    middle.isExtended &&
    ring.isFolded &&
    pinky.isFolded &&
    indexMiddleSpread > 0.25
  );

  // Match Priority Decision Logic
  let selectedGesture = GESTURE_TYPES.UNKNOWN;
  let confidence = 0.5;

  if (isThumbsUp && thumbsUpScore > 0.60) {
    selectedGesture = GESTURE_TYPES.THUMBS_UP;
    confidence = Math.min(0.99, Math.max(0.65, thumbsUpScore));
  } else if (isVictory && victoryScore > 0.60) {
    selectedGesture = GESTURE_TYPES.VICTORY;
    confidence = Math.min(0.99, Math.max(0.65, victoryScore));
  } else if (isOpenHand && openHandScore > 0.60) {
    selectedGesture = GESTURE_TYPES.OPEN_HAND;
    confidence = Math.min(0.99, Math.max(0.65, openHandScore));
  } else if (isFist && fistScore > 0.60) {
    selectedGesture = GESTURE_TYPES.FIST;
    confidence = Math.min(0.99, Math.max(0.65, fistScore));
  } else {
    // If borderline, check top score with higher threshold
    const candidates = [
      { type: GESTURE_TYPES.OPEN_HAND, score: openHandScore },
      { type: GESTURE_TYPES.FIST, score: fistScore },
      { type: GESTURE_TYPES.THUMBS_UP, score: thumbsUpScore },
      { type: GESTURE_TYPES.VICTORY, score: victoryScore },
    ].sort((a, b) => b.score - a.score);

    if (candidates[0].score >= 0.78) {
      selectedGesture = candidates[0].type;
      confidence = Math.min(0.96, candidates[0].score);
    } else {
      selectedGesture = GESTURE_TYPES.UNKNOWN;
      confidence = Math.round(candidates[0].score * 100) / 100;
    }
  }

  return {
    gesture: selectedGesture,
    ...GESTURE_INFO[selectedGesture],
    confidence: Math.round(confidence * 100) / 100,
    fingerStates,
    metrics: {
      openHandScore: Math.round(openHandScore * 100) / 100,
      fistScore: Math.round(fistScore * 100) / 100,
      thumbsUpScore: Math.round(thumbsUpScore * 100) / 100,
      victoryScore: Math.round(victoryScore * 100) / 100,
      indexMiddleSpread: Math.round(indexMiddleSpread * 100) / 100,
      handScale: Math.round(analysis.handScale * 100) / 100,
      handedness
    }
  };
}
