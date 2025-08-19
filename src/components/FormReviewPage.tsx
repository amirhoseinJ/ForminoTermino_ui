import { useEffect, useState } from "react";
import { ArrowLeft, Download, Home } from "lucide-react";
import { Button } from "./ui/button";
import type { Page } from "../types/navigation";

interface FormReviewPageProps {
    onNavigate: (page: Page) => void;
    pdfUrl?: string;
    fileName?: string;
}

export default function FormReviewPage({ onNavigate, pdfUrl, fileName }: FormReviewPageProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [blobErr, setBlobErr] = useState<string | null>(null);

    useEffect(() => {
        if (!pdfUrl) return;
        let objectUrl: string | null = null;

        (async () => {
            try {
                setBlobErr(null);
                const res = await fetch(pdfUrl, { credentials: "include" });
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
            } catch (e: any) {
                setBlobErr(e?.message || "Failed to load PDF");
            }
        })();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [pdfUrl]);

    const downloadHref = blobUrl || pdfUrl;

    return (
        <div
            className="min-h-dvh md:min-h-screen relative overflow-x-hidden overflow-y-auto flex flex-col"
            style={{
                background:
                    "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            {/* Header */}
            <div className="bg-card border-b px-4 py-3 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => onNavigate("hub")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-lg">Review PDF</h1>
                            <p className="text-xs text-muted-foreground">Preview and download</p>
                        </div>
                    </div>

                    {downloadHref && (
                        <a href={downloadHref} download={fileName || "filled-form.pdf"}>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            {/* PDF Preview */}
            <div className="flex-1 p-4">
                {blobUrl ? (
                    <div className="h-full w-full rounded-lg overflow-hidden border">
                        <iframe src={blobUrl} title="Filled Form PDF" className="w-full h-[calc(100vh-200px)]" />
                    </div>
                ) : blobErr ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center border rounded-lg gap-2">
                        <p className="text-sm text-muted-foreground">{blobErr}</p>
                        {pdfUrl && (
                            <a className="underline" href={pdfUrl} target="_blank" rel="noreferrer">
                                Open PDF in a new tab
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="h-[60vh] flex items-center justify-center border rounded-lg">
                        <p className="text-sm text-muted-foreground">Loading PDF…</p>
                    </div>
                )}
            </div>

            {/* Bottom action */}
            <div className="p-4 border-t bg-card">
                <Button className="w-full" onClick={() => onNavigate("hub")}>
                    <Home className="mr-2 h-4 w-4" />
                    Back to Hub
                </Button>
            </div>
        </div>
    );
}
