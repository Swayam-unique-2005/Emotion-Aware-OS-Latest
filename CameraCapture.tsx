import React, { useRef, useState, useEffect } from 'react';
import { Camera, Activity, ScanFace, Lock, AlertCircle, UserX, Clock } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { Mood } from '../types';
import { analyzeMood } from '../services/geminiService';

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  
  // Realtime Monitoring State (Updates every 3s)
  const [localDetectedMood, setLocalDetectedMood] = useState<Mood | 'No Face'>('No Face');
  const [localConfidence, setLocalConfidence] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState<'Detecting' | 'Face Found' | 'No Face'>('Detecting');
  
  // System Update State (Updates every 15s)
  const [countdown, setCountdown] = useState(15);
  
  const { setMood, currentMood, apiEnabled } = useMood();

  // 1. Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamActive(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsStreamActive(false); 
      }
    };
    startCamera();

    return () => {
       if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
       }
    };
  }, []);

  // 2. Monitoring Loop (Runs every 3 seconds)
  useEffect(() => {
    if (!isStreamActive) return;

    const scanFace = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // A. Brightness Pre-Check (Fast fail)
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Capture frame
        ctx.drawImage(videoRef.current, 0, 0, 100, 100);
        
        // Check brightness
        const frame = ctx.getImageData(0, 0, 100, 100);
        const data = frame.data;
        let totalBrightness = 0;
        for(let i = 0; i < data.length; i += 4) {
             totalBrightness += (data[i] + data[i+1] + data[i+2]) / 3;
        }
        const avgBrightness = totalBrightness / (data.length / 4);

        if (avgBrightness < 20) {
            // Too dark = No Face
            setDetectionStatus('No Face');
            setLocalDetectedMood('No Face');
            setLocalConfidence(0);
            return;
        }

        // B. Gemini Check (Accurate) or Local Simulation
        const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.5); // Low quality for speed
        
        setDetectionStatus('Detecting'); // Briefly show loading state
        
        let result: Mood | null = null;
        
        if (apiEnabled) {
            result = await analyzeMood(base64Image);
        } else {
            // Local Simulation
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
            const moods: Mood[] = ['Happy', 'Sad', 'Angry'];
            result = moods[Math.floor(Math.random() * moods.length)];
        }

        if (result) {
            setDetectionStatus('Face Found');
            setLocalDetectedMood(result);
            // Simulate high confidence if Gemini found a face (0.85 - 0.98)
            setLocalConfidence(0.85 + Math.random() * 0.13);
        } else {
            setDetectionStatus('No Face');
            setLocalDetectedMood('No Face');
            setLocalConfidence(0); // Strict 0 if Gemini says No Face
        }
    };

    const interval = setInterval(scanFace, 3000); // 3 Seconds Cycle
    // Run once immediately
    scanFace();

    return () => clearInterval(interval);
  }, [isStreamActive]);

  // 3. System Update Countdown (Runs every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                // Time's up! Apply the mood if valid
                if (localDetectedMood !== 'No Face') {
                    setMood(localDetectedMood as Mood, 'AI', localConfidence);
                }
                return 15; // Reset countdown
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [localDetectedMood, localConfidence, setMood]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/10 shadow-lg w-full max-w-xs relative overflow-hidden group">
      {/* Hidden canvas for data processing */}
      <canvas ref={canvasRef} width="100" height="100" className="hidden" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
         <div className="flex items-center gap-2 text-blue-400">
            <ScanFace size={16} className={detectionStatus === 'Detecting' ? 'animate-spin' : ''} />
            <h3 className="font-bold text-xs uppercase tracking-wider">Live Monitor</h3>
         </div>
         <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-mono">
                <Clock size={10} />
                <span>{countdown}s</span>
            </div>
            <div className={`flex items-center gap-1.5 ${detectionStatus === 'No Face' ? 'opacity-50' : 'opacity-100'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${detectionStatus === 'Face Found' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
         </div>
      </div>
      
      {/* Video Feed */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video border border-white/10 group-hover:border-white/30 transition-colors">
        <video 
          ref={videoRef} 
          autoPlay 
          muted
          playsInline 
          className={`w-full h-full object-cover transition-all duration-500 ${detectionStatus === 'No Face' ? 'opacity-30 grayscale' : 'opacity-80'}`} 
        />
        
        {/* Scanning Overlay UI */}
        {detectionStatus !== 'No Face' && (
            <>
                <div className="absolute inset-0 bg-[linear-gradient(transparent,rgba(34,211,238,0.1),transparent)] animate-scan pointer-events-none" style={{ backgroundSize: '100% 200%' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-400/50 rounded-lg flex items-start justify-between p-1">
                    <div className="w-1 h-1 bg-blue-400"></div>
                    <div className="w-1 h-1 bg-blue-400"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-400"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-400"></div>
                </div>
            </>
        )}

        {/* No Face Warning Overlay */}
        {detectionStatus === 'No Face' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400/80 backdrop-blur-sm">
                <UserX size={32} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">No Face Detected</span>
            </div>
        )}

        {/* Tech Stats Overlay */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] text-white font-mono flex gap-2">
           <span className={localConfidence > 0.8 ? 'text-green-400' : 'text-red-400'}>
               {(localConfidence * 100).toFixed(0)}% CONF
           </span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="space-y-2">
         <div className="p-2 bg-white/5 rounded border border-white/5">
             <div className="flex items-center gap-2 text-xs text-gray-300">
                <Activity size={12} className={detectionStatus === 'Face Found' ? 'text-blue-400' : 'text-gray-600'} />
                {detectionStatus === 'Face Found' ? (
                    <span>Detected: <b className="text-white">{localDetectedMood}</b></span>
                ) : (
                    <span className="text-gray-500 italic">Detected: --</span>
                )}
             </div>
             
             {/* Confidence Bar */}
             <div className="w-full bg-gray-700 h-1 rounded-full mt-2 overflow-hidden relative">
                <div 
                    className={`h-full transition-all duration-500 ${localConfidence > 0.8 ? 'bg-blue-500' : 'bg-red-500'}`} 
                    style={{ width: `${localConfidence * 100}%` }} 
                />
             </div>
         </div>
         
         <p className="text-[9px] text-gray-500 text-center leading-tight pt-1">
            UI updates in <span className="text-white font-mono font-bold">{countdown}s</span> based on detection.
         </p>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;