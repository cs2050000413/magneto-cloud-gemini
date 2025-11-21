
import React, { useEffect, useRef, useState } from 'react';
import { Magnet } from '../types';
import { identifyMagnetFromImage } from '../services/geminiService';

interface CameraScannerProps {
  allMagnets: Magnet[];
  onUnlock: (magnet: Magnet) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ allMagnets, onUnlock }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const simulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate finding a random magnet, excluding secret/reward ones
      const scannableMagnets = allMagnets.filter(m => !m.isSecret);
      if (scannableMagnets.length > 0) {
        const randomMagnet = scannableMagnets[Math.floor(Math.random() * scannableMagnets.length)];
        onUnlock(randomMagnet);
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleAiIdentify = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setAiResult("AI 正在分析图像...");

    // Capture frame
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);

    const result = await identifyMagnetFromImage(dataUrl);
    setIsScanning(false);
    
    if (result) {
        setAiResult(`Gemini 识别结果: ${result}`);
        setTimeout(() => {
             // Unlock random non-secret magnet for demo purpose matching the "visual"
             const scannableMagnets = allMagnets.filter(m => !m.isSecret);
             if (scannableMagnets.length > 0) {
                const randomMagnet = scannableMagnets[Math.floor(Math.random() * scannableMagnets.length)];
                onUnlock(randomMagnet);
             }
        }, 2000);
    } else {
        setAiResult("无法识别该冰箱贴");
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900 text-white">
        <i className="fas fa-camera-slash text-4xl mb-4 text-red-400"></i>
        <p>无法访问相机，请在设置中允许权限。</p>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full pt-12 pb-24">
        
        <div className="text-white text-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
            <p className="font-semibold">扫描冰箱贴或二维码</p>
        </div>

        {/* Scan Frame */}
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
           <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1 rounded-tl-lg"></div>
           <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1 rounded-tr-lg"></div>
           <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1 rounded-bl-lg"></div>
           <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1 rounded-br-lg"></div>
           
           {isScanning && (
             <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
           )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 w-full px-8">
          {aiResult && (
              <div className="bg-indigo-900/80 text-indigo-100 p-3 rounded-lg text-sm mb-2 max-w-xs text-center backdrop-blur-sm border border-indigo-500/30">
                  {aiResult}
              </div>
          )}

          <div className="flex gap-4 w-full justify-center">
              <button
                onClick={simulateQRScan}
                disabled={isScanning}
                className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <i className="fas fa-qrcode"></i> 扫码
              </button>
              
              <button
                onClick={handleAiIdentify}
                disabled={isScanning}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <i className="fas fa-wand-magic-sparkles"></i> AI 识别
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
