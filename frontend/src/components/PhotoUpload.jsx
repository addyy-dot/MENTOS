import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, User, RefreshCw, X, Video } from 'lucide-react';
import { getInitials } from '../utils/initials';

const PhotoUpload = ({ value, onChange, fullName }) => {
  const [mode, setMode] = useState('none'); // 'none', 'camera'
  const [cameraError, setCameraError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error(err);
      setCameraError('Webcam access was denied or is not available. Please allow access or upload a file.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setMode('none');
  };

  const compressImage = (imageSrc, callback) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max_size = 300;
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio while keeping size optimized
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Compress to JPEG with 0.75 quality for small size
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      callback(dataUrl);
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        compressImage(event.target.result, (compressed) => {
          onChange(compressed);
          setMode('none');
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      
      // Draw centered square clip for perfect circle avatars
      const size = Math.min(canvas.width, canvas.height);
      const startX = (canvas.width - size) / 2;
      const startY = (canvas.height - size) / 2;

      const destCanvas = document.createElement('canvas');
      destCanvas.width = 300;
      destCanvas.height = 300;
      const destCtx = destCanvas.getContext('2d');
      destCtx.drawImage(video, startX, startY, size, size, 0, 0, 300, 300);

      const dataUrl = destCanvas.toDataURL('image/jpeg', 0.75);
      onChange(dataUrl);
      stopCamera();
    }
  };

  const removePhoto = () => {
    onChange('');
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-[#111827] border border-slate-800/80 p-5 rounded-2xl w-full max-w-sm mx-auto">
      {/* Current Photo or Initials Preview */}
      <div className="relative group w-28 h-28 rounded-full bg-blue-955 border border-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-3xl uppercase overflow-hidden shadow-md">
        {value ? (
          <img src={value} alt="Profile Preview" className="w-full h-full object-cover" />
        ) : (
          getInitials(fullName)
        )}
      </div>

      {/* Mode panels */}
      {mode === 'camera' && (
        <div className="w-full max-w-sm flex flex-col items-center gap-3 bg-[#1E293B] p-4 rounded-xl border border-slate-700/60">
          <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border border-slate-800">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                {cameraError ? (
                  <span className="text-red-400">{cameraError}</span>
                ) : (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin mb-2 text-slate-400" />
                    <span>Connecting camera...</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full">
            {isCameraActive && (
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Capture Photo
              </button>
            )}
            <button
              type="button"
              onClick={stopCamera}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons when camera is not open */}
      {mode !== 'camera' && (
        <div className="flex flex-wrap gap-2 justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={triggerFileBrowser}
            className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-800 text-slate-200 border border-slate-750 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Browse Photo
          </button>

          <button
            type="button"
            onClick={startCamera}
            className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-800 text-slate-200 border border-slate-750 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" /> Capture Photo
          </button>

          {value && (
            <button
              type="button"
              onClick={removePhoto}
              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
