import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraModal = ({ isOpen, onClose, onPhotoCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'

  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    setCapturedFile(null);

    try {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access is needed to photograph your plant. Please check camera permissions in your browser.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);

    // Convert dataUrl to File object for AI upload
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `plant-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCapturedFile(null);
  };

  const confirmPhoto = () => {
    if (capturedPhoto && capturedFile) {
      onPhotoCaptured({ dataUrl: capturedPhoto, file: capturedFile });
      stopCamera();
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card p-6 max-w-lg w-full border border-[var(--color-border)] shadow-2xl relative overflow-hidden flex flex-col items-center"
      >
        <button
          onClick={() => { stopCamera(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface-elevated)] z-20"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Camera size={20} className="text-[var(--color-emerald-main)] animate-pulse" />
          <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
            Plant Camera 🌿
          </h3>
        </div>

        {/* ERROR STATE */}
        {cameraError ? (
          <div className="p-6 text-center space-y-4 my-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
            <AlertCircle size={36} className="text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium max-w-xs">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-5 py-2 rounded-xl bg-[var(--color-emerald-main)] text-white text-xs font-bold shadow-md"
            >
              TRY AGAIN
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden bg-black border border-[var(--color-border)] shadow-inner flex items-center justify-center">
            {capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured Plant" className="w-full h-full object-cover" />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* BOTANICAL CAMERA OVERLAY GUIDANCE FRAME */}
                <div className="absolute inset-6 border-2 border-dashed border-emerald-400/60 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="text-center bg-black/50 backdrop-blur-xs py-1.5 px-3 rounded-full text-[11px] font-bold text-emerald-300 self-center">
                    🌿 Place leaves inside frame • Good lighting helps AI
                  </div>
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* CONTROLS FOOTER */}
        {!cameraError && (
          <div className="flex items-center justify-between w-full mt-6 gap-3">
            {capturedPhoto ? (
              <>
                <button
                  onClick={retakePhoto}
                  className="flex-1 py-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-main)] font-bold text-xs border border-[var(--color-border)] transition-all"
                >
                  RETAKE
                </button>
                <button
                  onClick={confirmPhoto}
                  className="flex-1 py-3 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>USE PHOTO</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleFacingMode}
                  className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border-subtle)]"
                  title="Switch Camera"
                >
                  <RefreshCw size={18} />
                </button>

                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  <span>CAPTURE PHOTO 🌿</span>
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
