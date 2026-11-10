/**
 * Landmark Utilities for MediaPipe 21 Hand Landmarks
 *
 * MediaPipe Hand Landmark Indices:
 * 0: WRIST
 * 1-4: THUMB (CMC, MCP, IP, TIP)
 * 5-8: INDEX (MCP, PIP, DIP, TIP)
 * 9-12: MIDDLE (MCP, PIP, DIP, TIP)
 * 13-16: RING (MCP, PIP, DIP, TIP)
 * 17-20: PINKY (MCP, PIP, DIP, TIP)
 */

export const LANDMARK_NAMES = {
  0: 'WRIST',
  1: 'THUMB_CMC', 2: 'THUMB_MCP', 3: 'THUMB_IP', 4: 'THUMB_TIP',
  5: 'INDEX_MCP', 6: 'INDEX_PIP', 7: 'INDEX_DIP', 8: 'INDEX_TIP',
  9: 'MIDDLE_MCP', 10: 'MIDDLE_PIP', 11: 'MIDDLE_DIP', 12: 'MIDDLE_TIP',
  13: 'RING_MCP', 14: 'RING_PIP', 15: 'RING_DIP', 16: 'RING_TIP',
  17: 'PINKY_MCP', 18: 'PINKY_PIP', 19: 'PINKY_DIP', 20: 'PINKY_TIP',
};

// Hand connection skeleton pairs
export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

/**
 * 2D Euclidean Distance
 */
export function distance2D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 3D Euclidean Distance (using z if available)
 */
export function distance3D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate 2D angle at point B between vectors BA and BC in degrees (0 - 180)
 */
export function calculateAngle(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (mag1 * mag2 === 0) return 0;
  const cosine = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * Scale factor of the hand (distance from Wrist (0) to Middle MCP (9))
 */
export function getHandScale(landmarks) {
  if (!landmarks || landmarks.length < 10) return 1;
  const d = distance2D(landmarks[0], landmarks[9]);
  return d > 0.01 ? d : 0.1;
}

/**
 * Get Hand Bounding Box from normalized coordinates
 */
export function getHandBoundingBox(landmarks, width, height, padding = 20) {
  if (!landmarks || landmarks.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of landmarks) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const pxMin = Math.max(0, minX * width - padding);
  const pxMax = Math.min(width, maxX * width + padding);
  const pyMin = Math.max(0, minY * height - padding);
  const pyMax = Math.min(height, maxY * height + padding);

  return {
    x: pxMin,
    y: pyMin,
    width: Math.max(10, pxMax - pxMin),
    height: Math.max(10, pyMax - pyMin),
    normalized: {
      minX, maxX, minY, maxY
    }
  };
}

/**
 * Draw Futuristic Hand Landmark Skeleton on HTML5 Canvas
 */
export function drawHandSkeleton(ctx, landmarks, width, height, options = {}) {
  if (!ctx || !landmarks || landmarks.length < 21) return;

  const {
    isMirrored = true,
    showBoundingBox = true,
    gestureName = '',
    confidence = 0,
    handIndex = 0
  } = options;

  ctx.save();

  // Helper to map normalized coordinates to canvas pixel space
  const mapPoint = (p) => {
    let px = p.x * width;
    if (isMirrored) {
      px = (1 - p.x) * width;
    }
    const py = p.y * height;
    return { x: px, y: py, z: p.z || 0 };
  };

  const points = landmarks.map(mapPoint);

  // 1. Draw glowing connection lines (bones)
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw outer cyan glow for bones
  ctx.strokeStyle = 'rgba(85, 214, 255, 0.45)';
  ctx.lineWidth = 7;
  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const p1 = points[startIdx];
    const p2 = points[endIdx];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Draw sharp electric blue inner bones
  ctx.strokeStyle = '#258BFF';
  ctx.lineWidth = 3;
  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const p1 = points[startIdx];
    const p2 = points[endIdx];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // 2. Draw 21 Landmark Nodes
  points.forEach((p, idx) => {
    const isWrist = idx === 0;
    const isTip = [4, 8, 12, 16, 20].includes(idx);

    if (isWrist) {
      // Pulsing glowing wrist anchor
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(85, 214, 255, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#1677FF';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else if (isTip) {
      // Fingertips: Cyan glowing dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(85, 214, 255, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#55D6FF';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else {
      // Joint nodes: Electric blue dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#1677FF';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
  });

  // 3. Draw Cyber Bounding Box if requested
  if (showBoundingBox) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const pad = 24;
    const bx = Math.max(8, minX - pad);
    const by = Math.max(8, minY - pad);
    const bw = Math.min(width - bx - 8, (maxX - minX) + pad * 2);
    const bh = Math.min(height - by - 8, (maxY - minY) + pad * 2);

    // Bounding Box outline with soft cyan
    ctx.strokeStyle = 'rgba(37, 139, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    // Corner brackets
    const bracketLen = Math.min(22, bw * 0.25, bh * 0.25);
    ctx.strokeStyle = '#55D6FF';
    ctx.lineWidth = 3;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(bx, by + bracketLen);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + bracketLen, by);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(bx + bw - bracketLen, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - bracketLen);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + bracketLen, by + bh);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(bx + bw - bracketLen, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - bracketLen);
    ctx.stroke();

    // HUD Badge tag on top of box
    if (gestureName && gestureName !== 'None' && gestureName !== 'No Hand Detected') {
      const label = `${gestureName.toUpperCase()} • ${Math.round(confidence * 100)}%`;
      ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const tagW = textWidth + 16;
      const tagH = 22;
      const tagY = Math.max(4, by - tagH - 4);

      // Badge background
      ctx.fillStyle = 'rgba(9, 43, 89, 0.85)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(bx, tagY, tagW, tagH, 4) : ctx.rect(bx, tagY, tagW, tagH);
      ctx.fill();

      ctx.strokeStyle = '#258BFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#55D6FF';
      ctx.fillText(label, bx + 8, tagY + 15);
    }
  }

  ctx.restore();
}
