import { useState, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Upload, FileText, Image, Check, X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface UploadFilePageProps {
  onBack: () => void;
    onComplete: ( description: string, documentId: string ) => void;
}


const API_BASE = import.meta.env.BASE_URL

export default function UploadFilePage({ onBack, onComplete }: UploadFilePageProps) {

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
      const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, image, or Word document');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

      setSelectedFile(file); // <-- Save the actual File object here

      // Simulate upload progress and set preview
      setIsProcessing(true);
      setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        setUploadedFile({
          name: file.name,
          type: file.type,
          data: e.target?.result as string
        });
        setIsProcessing(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setSelectedFile(null);
        setUploadProgress(0);
    };

    const handleConfirm = async () => {
        if (!uploadedFile || !selectedFile) return;

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('file', selectedFile); // the actual file!
        formData.append('name', selectedFile.name);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE}/api/users/documents/`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.detail || "Upload failed.");
                setIsProcessing(false);
                return;
            }
            const data = await response.json();
            setIsProcessing(false);
            setUploadedFile(null);
            setSelectedFile(null);
            setUploadProgress(0);

            // Expect { description: ... } from backend!
            if (data.description) {
                onComplete(data.description, data.documentId);
                // console.log(data.id)
            } else {
                alert("No description received from server.");
            }
        } catch (err) {
            alert("Error uploading file.");
            setIsProcessing(false);
        }
    };


    const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    return FileText;
  };

  const getFileSize = (data: string) => {
    const bytes = Math.round((data.length * 3) / 4);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="glass-card glass-glow-purple relative z-10 px-4 py-3 border-b border-glass-border flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="hover:bg-glass-bg hover:text-neon-purple"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-lg text-foreground">Upload File</h1>
                            <p className="text-xs text-muted-foreground">
                                {uploadedFile ? 'File ready for processing' : 'Select a PDF, image, or Word document'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
                {/* --- NEW: Progress bar during file read (before preview) --- */}
                {isProcessing && !uploadedFile ? (
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <div className="glass-card p-8 rounded-2xl border border-glass-border w-full max-w-md">
                            <div className="flex flex-col items-center gap-4">
                                <Upload className="h-8 w-8 text-neon-purple animate-bounce" />
                                <div className="w-full bg-glass-bg rounded-full h-3">
                                    <motion.div
                                        className="bg-gradient-to-r from-neon-purple to-purple-600 h-3 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.2 }}
                                        style={{ minWidth: 20 }}
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Checking your file... {uploadProgress}%
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    !uploadedFile ? (
                        <>
                            {/* Drag & Drop Area */}
                            <motion.div
                                className={`flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
                                    dragActive
                                        ? 'border-neon-purple bg-neon-purple/5 scale-105'
                                        : 'border-glass-border hover:border-neon-purple/50 hover:bg-glass-bg/30'
                                }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Upload animation */}
                                <motion.div
                                    className="text-center"
                                    animate={dragActive ? { scale: 1.1 } : {}}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative ${
                                            dragActive ? 'bg-neon-purple/20' : 'bg-glass-bg'
                                        }`}
                                        animate={dragActive ? {
                                            boxShadow: [
                                                '0 0 20px rgba(139, 92, 246, 0.3)',
                                                '0 0 40px rgba(139, 92, 246, 0.6)',
                                                '0 0 20px rgba(139, 92, 246, 0.3)'
                                            ]
                                        } : {}}
                                        transition={{ duration: 1, repeat: dragActive ? Infinity : 0 }}
                                    >
                                        <Upload className={`h-8 w-8 ${dragActive ? 'text-neon-purple' : 'text-muted-foreground'}`} />

                                        {dragActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-neon-purple"
                                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>

                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {dragActive ? 'Drop your file here' : 'Drag & drop your file'}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        or click to browse from your device
                                    </p>

                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choose File
                                    </Button>
                                </motion.div>

                                {/* Animated background particles */}
                                {dragActive && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-2 h-2 bg-neon-purple/30 rounded-full"
                                                style={{
                                                    left: `${Math.random() * 100}%`,
                                                    top: `${Math.random() * 100}%`,
                                                }}
                                                animate={{
                                                    y: [0, -50, 0],
                                                    opacity: [0, 1, 0],
                                                    scale: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: Math.random() * 2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Supported formats */}
                            <motion.div
                                className="mt-6 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-sm text-muted-foreground mb-3">Supported formats:</p>
                                <div className="flex items-center justify-center gap-4 flex-wrap">
                                    {[
                                        { type: 'PDF', icon: FileText, color: 'text-red-500' },
                                        { type: 'JPG', icon: Image, color: 'text-blue-500' },
                                        { type: 'PNG', icon: Image, color: 'text-green-500' },
                                        { type: 'DOC', icon: FileText, color: 'text-blue-600' },
                                        { type: 'DOCX', icon: FileText, color: 'text-blue-600' },
                                    ].map((format) => (
                                        <div key={format.type} className="flex items-center gap-2 px-3 py-1 glass-card rounded-lg border border-glass-border">
                                            <format.icon className={`h-4 w-4 ${format.color}`} />
                                            <span className="text-xs font-medium text-foreground">{format.type}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">Maximum file size: 10MB</p>
                            </motion.div>
                        </>
                    ) : (
                        /* File Preview */
                        <motion.div
                            className="flex-1 flex flex-col"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* File Card */}
                            <div className="glass-card p-6 rounded-2xl border border-glass-border relative overflow-hidden">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-neon-purple/10 rounded-xl">
                                        {(() => {
                                            const IconComponent = getFileIcon(uploadedFile.type);
                                            return <IconComponent className="h-8 w-8 text-neon-purple" />;
                                        })()}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">{uploadedFile.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {uploadedFile.type.split('/')[1].toUpperCase()} • {getFileSize(uploadedFile.data)}
                                        </p>

                                        {/* Processing indicator */}
                                        {isProcessing && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    {/* Loading circle (no percentage) */}
                                                    <div className="h-5 w-5 rounded-full border-2 border-neon-purple/30 border-t-neon-purple animate-spin" />
                                                    <span className="text-xs text-muted-foreground">Processing...</span>
                                                </div>
                                            </div>
                                        )}

                                        {!isProcessing && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-neon-green" />
                                                <span className="text-sm text-neon-green font-medium">Ready for processing</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                        className="hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Success glow effect */}
                                {!isProcessing && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl pointer-events-none"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent)',
                                            filter: 'blur(20px)'
                                        }}
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                )}
                            </div>

                            {/* Action buttons */}
                            {!isProcessing && (
                                <motion.div
                                    className="mt-6 flex gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={handleRemoveFile}
                                        className="flex-1 border-glass-border hover:bg-glass-bg"
                                    >
                                        Choose Different File
                                    </Button>
                                    <Button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90"
                                    >
                                        Process This File
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                />
            </div>

            {/* Tips */}
            <div className="px-6 pb-6">
                <motion.div
                    className="glass-card p-4 rounded-lg border border-glass-border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground mb-1">Pro Tips:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Ensure documents are clear and well-lit</li>
                                <li>• PDF files work best for forms and documents</li>
                                <li>• Images should be high resolution for better accuracy</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}