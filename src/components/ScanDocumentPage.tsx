import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, RotateCcw, Check, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./contexts/AppContext";

interface ScanDocumentPageProps {
  onBack: () => void;
  onComplete: (description: string, documentId: string) => void;
}


const API_BASE = import.meta.env.BASE_URL

export default function ScanDocumentPage({ onBack, onComplete }: ScanDocumentPageProps) {


    useApp();
    const [isScanning, setIsScanning] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);


    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);
    const handleStartScan = async () => {
        setIsScanning(true);
        setCapturedImage(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            alert("Could not access camera. Please allow permission.");
            setIsScanning(false);
        }
    };

    const handleStopScan = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
    };



    const handleTakePhoto = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL("image/png");
                setCapturedImage(imageData);
            }
            handleStopScan();
        }
    };




    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



    const handleRetake = () => {
        setCapturedImage(null);
        setIsProcessing(false);
        handleStartScan();
    };


    const handleConfirm = async () => {
        if (!capturedImage) return;

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE}/api/users/documents/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    image: capturedImage, // base64 string
                    tag: "none",          // required tag field
                }),
            });
            if (!res.ok) throw new Error("Failed to upload document");
            const data = await res.json();

            setIsProcessing(false);

            // Send the description (not image) to onComplete
            if (data.description) {
                onComplete(data.description, data.documentId);
            } else {
                // fallback if backend doesn't return description
                alert("No description received from server.");
            }
        } catch (err) {
            setIsProcessing(false);
            alert("Failed to upload document: " + (err instanceof Error ? err.message : "unknown error"));
        }
    };



    const renderCameraView = () => (
        <motion.div
            className="flex-1 flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="relative w-full max-w-[480px] aspect-[4/3] flex items-center justify-center">
                {/* Live camera */}
                {isScanning ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain rounded-lg bg-black"
                        autoPlay
                        playsInline
                        muted
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-lg">
                        <Camera className="h-16 w-16 mb-4 text-gray-400" />
                        <p className="text-lg mb-2 text-white">Camera is off</p>
                        <p className="text-sm text-gray-300">Tap the camera to turn on</p>
                    </div>
                )}

                {/* Overlay border (frame) */}
                <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="w-full h-full border-4 border-white/60 rounded-lg animate-pulse" />
                    {/* Corners */}
                    <div className="absolute -top-0 -left-1 w-6 h-6 border-l-4 border-t-4 border-neon-green rounded-tl-lg" />
                    <div className="absolute -top-0 -right-1 w-6 h-6 border-r-4 border-t-4 border-neon-green rounded-tr-lg" />
                    <div className="absolute -bottom-0 -left-1 w-6 h-6 border-l-4 border-b-4 border-neon-green rounded-bl-lg" />
                    <div className="absolute -bottom-0 -right-1 w-6 h-6 border-r-4 border-b-4 border-neon-green rounded-br-lg" />
                </div>
            </div>
        </motion.div>
    );


    const renderCapturedImage = () => (
        <motion.div
            className="flex-1 flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="relative w-full max-w-[480px] aspect-[4/3] flex items-center justify-center">
                <img
                    src={capturedImage!}
                    alt="Captured document"
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                />

                {/* Optional: border for the captured image as in live camera */}
                <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="w-full h-full border-4 border-white/60 rounded-lg" />
                    <div className="absolute -top-0 -left-1 w-6 h-6 border-l-4 border-t-4 border-neon-green rounded-tl-lg" />
                    <div className="absolute -top-0 -right-1 w-6 h-6 border-r-4 border-t-4 border-neon-green rounded-tr-lg" />
                    <div className="absolute -bottom-0 -left-1 w-6 h-6 border-l-4 border-b-4 border-neon-green rounded-bl-lg" />
                    <div className="absolute -bottom-0 -right-1 w-6 h-6 border-r-4 border-b-4 border-neon-green rounded-br-lg" />
                </div>
            </div>

            {/* Overlay with processing indicator */}
            {isProcessing && (
                <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center text-white">
                        <motion.div
                            className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-lg">Processing document...</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );



    return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="glass-card glass-glow-green relative z-10 px-4 py-3 border-b border-glass-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-glass-bg hover:text-neon-green"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg text-foreground">Scan Document</h1>
              <p className="text-xs text-muted-foreground">
                {capturedImage ? 'Review your scan' : 'Position document in frame'}
              </p>
            </div>
          </div>
          
          {/* Upload from gallery option */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Gallery
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Camera/Image View */}
      <div className="flex-1 p-4 flex flex-col">
        {capturedImage ? renderCapturedImage() : renderCameraView()}
      </div>

      {/* Bottom Controls */}
      <div className="glass-card border-t border-glass-border p-6 flex-shrink-0">
        {capturedImage ? (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleRetake}
              disabled={isProcessing}
              className="flex-1 border-glass-border hover:bg-glass-bg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Use This Scan
            </Button>
          </div>
        ) : (
            <div className="flex justify-center">
                <motion.button
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-green to-green-600 flex items-center justify-center relative overflow-hidden group"
                    onClick={isScanning ? handleTakePhoto : handleStartScan}
                    disabled={false}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    {isScanning
                        ? <Check className="h-8 w-8 text-white" />
                        : <Camera className="h-8 w-8 text-white" />
                    }
                    {/* Optional: Show a pulse effect when scanning */}
                    {isScanning && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-neon-green"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </motion.button>
            </div>

        )}
      </div>

      {/* Instructions */}
      <div className="px-6 pb-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            {capturedImage 
              ? 'Review the scan quality and confirm to continue'
              : isScanning 
              ? 'Keep the device steady while scanning'
              : 'Tap the camera button to capture your document'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}