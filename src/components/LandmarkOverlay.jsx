import React, { useRef, useEffect } from 'react';
import { drawHandSkeleton } from '../utils/landmarkUtils';

export default function LandmarkOverlay({
  landmarks,
  allHandsLandmarks = [],
  videoRef,
  isMirrored = true,
  currentGesture = null,
  showSkeleton = true,
  showBoundingBox = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef?.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Synchronize canvas coordinate resolution with video's display rect
    const updateCanvasDimensions = () => {
      if (video && video.clientWidth > 0 && video.clientHeight > 0) {
        if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;
        }
      }
    };

    updateCanvasDimensions();

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showSkeleton) return;

    // Draw all detected hands (or single hand)
    const handsToDraw = allHandsLandmarks && allHandsLandmarks.length > 0
      ? allHandsLandmarks
      : (landmarks ? [landmarks] : []);

    handsToDraw.forEach((handLandmarks, idx) => {
      drawHandSkeleton(ctx, handLandmarks, canvas.width, canvas.height, {
        isMirrored,
        showBoundingBox,
        gestureName: currentGesture?.name || '',
        confidence: currentGesture?.confidence || 0,
        handIndex: idx
      });
    });
  }, [landmarks, allHandsLandmarks, videoRef, isMirrored, currentGesture, showSkeleton, showBoundingBox]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        transform: 'none', // Landmark mapping maps mirrored coordinates directly in mathematical pixel space
      }}
    />
  );
}
