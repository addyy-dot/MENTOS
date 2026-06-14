import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, User, RefreshCw, X } from 'lucide-react';
import { getInitials } from '../utils/initials';

const PhotoUpload = ({ value, onChange, fullName }) => {
  const [mode, setMode] = useState('none'); // 'none', 'camera', 'crop'
  const [cameraError, setCameraError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Cropper states
  const [tempImage, setTempImage] = useState('');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ baseWidth: 0, baseHeight: 0 });

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setMode('crop');
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
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      setTempImage(dataUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setMode('crop');
      stopCamera();
    }
  };

  const removePhoto = () => {
    onChange('');
    stopCamera();
  };

  // Cropper Event Handlers
  const handleImageLoad = (e) => {
    const img = e.target;
    const containerWidth = 260;
    const containerHeight = 260;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    let baseWidth = containerWidth;
    let baseHeight = containerHeight;
    
    if (aspectRatio > 1) {
      baseHeight = containerHeight;
      baseWidth = containerHeight * aspectRatio;
    } else {
      baseWidth = containerWidth;
      baseHeight = containerWidth / aspectRatio;
    }
    
    setImageSize({ baseWidth, baseHeight });
  };

  const handleDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    const img = new Image();
    img.src = tempImage;
    img.onload = () => {
      const containerWidth = 260;
      const containerHeight = 260;
      const cropSize = 180;
      
      const { baseWidth, baseHeight } = imageSize;
      
      // Image position relative to container
      const imageLeft = containerWidth / 2 + offset.x - (baseWidth * zoom) / 2;
      const imageTop = containerHeight / 2 + offset.y - (baseHeight * zoom) / 2;
      
      // Crop area region relative to container
      const cropLeft = (containerWidth - cropSize) / 2;
      const cropTop = (containerHeight - cropSize) / 2;
      
      // Crop area region relative to image
      const relativeX = cropLeft - imageLeft;
      const relativeY = cropTop - imageTop;
      
      // Scale coordinates from rendered container size to natural dimensions
      const scale = img.naturalWidth / (baseWidth * zoom);
      
      const sourceX = relativeX * scale;
      const sourceY = relativeY * scale;
      const sourceWidth = cropSize * scale;
      const sourceHeight = cropSize * scale;
      
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // Paint background white (useful if image format is transparent)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 300, 300);
      
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 300, 300);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onChange(dataUrl);
      setMode('none');
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-[#111827] border border-slate-800/80 p-5 rounded-2xl w-full max-w-sm mx-auto">
      {/* Current Photo or Initials Preview (only shown when not cropping) */}
      {mode !== 'crop' && (
        <div className="relative group w-28 h-28 rounded-full bg-blue-955 border border-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-3xl uppercase overflow-hidden shadow-md">
          {value ? (
            <img src={value} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            getInitials(fullName)
          )}
        </div>
      )}

      {/* CROP MODE PANEL */}
      {mode === 'crop' && (
        <div className="w-full flex flex-col items-center gap-3 bg-[#1E293B] p-4 rounded-xl border border-slate-700/60">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Adjust Photo</h3>
          
          <div
            className="relative w-[260px] h-[260px] bg-[#0B0F19] rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center cursor-move select-none"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {tempImage && (
              <img
                src={tempImage}
                alt="Crop source"
                onLoad={handleImageLoad}
                style={{
                  width: `${imageSize.baseWidth}px`,
                  height: `${imageSize.baseHeight}px`,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            )}
            
            {/* Viewport Mask overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.75)]" />
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center px-4 mt-0.5">Drag to reposition, use slider to zoom</p>

          {/* Zoom slider control */}
          <div className="w-full flex items-center gap-3 px-2 mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full mt-2">
            <button
              type="button"
              onClick={applyCrop}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Apply Crop
            </button>
            <button
              type="button"
              onClick={() => setMode('none')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CAMERA MODE PANEL */}
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

      {/* MAIN VIEW ACTION BUTTONS */}
      {mode !== 'camera' && mode !== 'crop' && (
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
