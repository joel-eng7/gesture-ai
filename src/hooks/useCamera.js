import { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../utils/soundEffects';

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraStatus, setCameraStatus] = useState('idle'); // idle | initializing | ready | active | denied | error | unavailable
  const [errorMessage, setErrorMessage] = useState('');
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  // Enumerate available video cameras
  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setCameraStatus('unavailable');
        setErrorMessage('MediaDevices API not supported on this browser.');
        return;
      }
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.warn('Error enumerating devices:', err);
    }
  }, [currentDeviceId]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('idle');
    soundManager.playCameraChime(false);
  }, []);

  // Start Camera with selected device or default
  const startCamera = useCallback(async (deviceIdToUse = currentDeviceId) => {
    setCameraStatus('initializing');
    setErrorMessage('');

    // Check mediaDevices support
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unavailable');
      setErrorMessage('Webcam access is unavailable or requires HTTPS / localhost.');
      return false;
    }

    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceIdToUse ? undefined : 'user',
          deviceId: deviceIdToUse ? { exact: deviceIdToUse } : undefined
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;

        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(resolve);
          };
        });

        const w = videoRef.current.videoWidth || 640;
        const h = videoRef.current.videoHeight || 480;
        setVideoDimensions({ width: w, height: h });
      }

      setCameraStatus('active');
      soundManager.playCameraChime(true);
      refreshDevices();
      return true;
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraStatus('unavailable');
        setErrorMessage('No camera device found on your system.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraStatus('error');
        setErrorMessage('Camera is currently in use by another application or tab.');
      } else {
        setCameraStatus('error');
        setErrorMessage(err.message || 'Unable to access camera.');
      }
      return false;
    }
  }, [currentDeviceId, refreshDevices]);

  // Switch camera to another device if available
  const switchCamera = useCallback(async () => {
    if (devices.length < 2) return;
    const currentIndex = devices.findIndex(d => d.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDeviceId = devices[nextIndex].deviceId;
    setCurrentDeviceId(nextDeviceId);
    if (cameraStatus === 'active') {
      await startCamera(nextDeviceId);
    }
  }, [devices, currentDeviceId, cameraStatus, startCamera]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    cameraStatus,
    errorMessage,
    devices,
    currentDeviceId,
    isMirrored,
    videoDimensions,
    setIsMirrored,
    startCamera,
    stopCamera,
    switchCamera
  };
}
