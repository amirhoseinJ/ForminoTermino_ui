import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Link as LinkIcon, Globe, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SubmitLinkPageProps {
    onBack: () => void;
    onComplete: ( description: string, documentId: string ) => void;
}


const API_BASE = import.meta.env.VITE_API_BASE

export default function SubmitLinkPage({ onBack, onComplete }: SubmitLinkPageProps) {

    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateUrl = (inputUrl: string): boolean => {
        try {
            const urlObj = new URL(inputUrl);
            return ["http:", "https:"].includes(urlObj.protocol);
        } catch {
            return false;
        }
    };

    const safeJson = async (r: Response) => {
        try {
            return await r.json();
        } catch {
            return null;
        }
    };

    const handleConfirm = async () => {
        setError(null);
        if (!url.trim()) return;

        let processUrl = url.trim();
        if (!/^https?:\/\//i.test(processUrl)) processUrl = `https://${processUrl}`;

        if (!validateUrl(processUrl)) {
            setError("Please enter a valid URL (http/https).");
            return;
        }

        setIsSubmitting(true);
        setUrl(processUrl);

        try {
            const token = localStorage.getItem("accessToken");
            const resp = await fetch(`${API_BASE}/documents/from-link/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url: processUrl }),
            });

            if (!resp.ok) {
                const err = await safeJson(resp);
                setError(err?.detail || "Failed to create document from link.");
                setIsSubmitting(false);
                return;
            }

            const data = await resp.json();
            const documentId = data.documentId || data.public_id || data.id;
            if (!documentId) {
                setError("Server did not return a documentId.");
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            onComplete(
                 data.description ?? "",
                 data.documentId ?? ""
            );
        } catch (e) {
            console.error(e);
            setError("Network error while creating document.");
            setIsSubmitting(false);
        }
    };

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
                            <h1 className="text-lg text-foreground">Submit Link</h1>
                            <p className="text-xs text-muted-foreground">
                                {isSubmitting ? "Capturing screenshot…" : "Provide the URL of the web form"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* URL Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Web Form URL</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/form"
                                className="pl-10 h-12 bg-input-background border-glass-border focus:border-neon-green/50 focus:ring-neon-green/20"
                                style={{ backdropFilter: "blur(10px)" }}
                                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                            />
                        </div>

                        {/* Confirm Button */}
                        <Button
                            onClick={handleConfirm}
                            disabled={!url.trim() || isSubmitting}
                            className="w-full h-12 bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    {/* circular spinner */}
                                    <motion.div
                                        className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Processing Webpage…</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    <span>Confirm Link</span>
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="glass-card p-4 rounded-2xl border-2 border-red-500/30">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
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
                        <LinkIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground mb-1">Guidelines:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Use a publicly accessible form URL</li>
                                <li>• Pages behind login may fail to capture</li>
                                <li>• Make sure the page loads without blockers</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
