import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import Robot3DAvatar from "./Robot3DAvatar";
import AnimatedBackground from "./AnimatedBackground";
import SuccessAnimation from "./SuccessAnimation";
import type { Page } from "../types/navigation";
import {toast} from "react-hot-toast";

interface StartSessionResp {
    sessionId: string;
    message: string;
    field?: string;
    done: boolean;
    schema?: Record<string, string>;
}

interface MessageResp {
    message: string;
    field?: string;
    done: boolean;
    schema?: Record<string, string>;
}


interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  schema?: Record<string, string>; // ✅ add this
}

interface FormChatPageProps {
    onNavigate: (page: Page, data?: { pdfUrl?: string; fileName?: string }) => void;
    formData: { description: string, documentId: string };
}


const API_BASE = import.meta.env.VITE_API_BASE


export default function FormChatPage({ onNavigate, formData }: FormChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isDone, setIsDone] = useState(false);
    const [yesSubmitting, setYesSubmitting] = useState(false);

// helper to grab the latest schema we received from the AI
    const getLatestSchema = () => {
        // finds the most recent message that has a schema
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i]?.schema) return messages[i].schema;
        }
        return null;
    };

    const handleConfirmYes = async () => {
        const schema = getLatestSchema();
        if (!schema) {
            toast.error("No form schema to submit yet.");
            return;
        }
        if (!sessionId) {
            toast.error("Missing session. Please restart.");
            return;
        }

        try {
            setYesSubmitting(true);
            const token = localStorage.getItem("accessToken");

            // Follows your existing API shape: /sessions and /sessions/:id/message
            // Using a plausible endpoint for final confirmation:
            const res = await fetch(`${API_BASE}/form-chat/sessions/${sessionId}/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    schema,
                    documentId: formData.documentId,
                }), // send the full data.schema
            });

            // @ts-ignore
            const payload = await res.json();

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Failed confirming schema.");
            }

            toast.success("Form filled & saved as PDF!");
            onNavigate("form-review", {
                pdfUrl: payload.pdfUrl,
                fileName: payload.name,
            });

        } catch (e: any) {
            console.error(e);
            toast.error("Could not submit schema. Please try again.");
        } finally {
            setYesSubmitting(false);
        }
    };


    useEffect(() => {
        console.log(formData);
        setMessages([
            {
                id: 'desc',
                content: formData.description || "An Error Occured. Please try again.",
                sender: 'ai',
                timestamp: new Date()
            }
        ]);
    }, [formData.description]);


    // After initial description is rendered, start backend session
    useEffect(() => {
        if (!formData.description) return;

        const start = async () => {
            setAiThinking(true);
            try {
                const token = localStorage.getItem("accessToken"); // your JWT access token
                const res = await fetch(`${API_BASE}/form-chat/sessions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({ description: formData.description, documentId: formData.documentId }),
                });
                const data: StartSessionResp = await res.json();

                if (!res.ok) throw new Error(data as any);

                setSessionId(data.sessionId);

                // Push the first backend message, including schema if done
                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        content: data.message,
                        schema: data.done ? data.schema : undefined, // ← add this
                        sender: 'ai',
                        timestamp: new Date()
                    }
                ]);

                // If done, show success animation
                if (data.done) {
                    setIsDone(true); // ✅ show Yes/No instead of input

                    setTimeout(() => setShowSuccess(true), 800);   // ← add this
                }

            } catch (e: any) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        content: "Sorry—couldn’t start the form session.",
                        sender: 'ai',
                        timestamp: new Date()
                    }
                ]);
            } finally {
                setAiThinking(false);
            }
        };

        // We already pushed the description in your existing effect.
        // Now call start():
        start();
    }, [formData.description]);


  const [inputValue, setInputValue] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const readyForInput = Boolean(sessionId) && !aiThinking;


    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        if (!sessionId) {
            toast.error("Error!");
        }
        const text = inputValue.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            content: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setAiThinking(true);

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_BASE}/form-chat/sessions/${sessionId}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ text }),
            });
            const data: MessageResp = await res.json();
            if (!res.ok) throw new Error(data as any);

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: data.message,
                    schema: data.done ? data.schema : undefined,
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);

            // If done, show success animation and move to review (optional)
            if (data.done) {
                setIsDone(true); //  show Yes/No instead of input
                setTimeout(() => setShowSuccess(true), 800);
            }
        } catch (e: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: "Oops—something went wrong saving that. Please try again.",
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setAiThinking(false);
        }
    };


  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // onNavigate('form-review');
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="glass-card glass-glow-purple relative z-10 px-4 py-3 flex-shrink-0 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('form-submission')}
              className="hover:bg-glass-bg hover:text-neon-purple"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Robot3DAvatar size="sm" isThinking={aiThinking} expression={aiThinking ? 'processing' : 'happy'} />
              <div>
                <h1 className="text-lg text-foreground">Form Assistant</h1>
                <p className="text-xs text-muted-foreground">
                  {aiThinking ? 'Processing...' : 'Online & Ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender === 'ai' && (
                  <Robot3DAvatar size="sm" isThinking={false} expression="happy" />
                )}
                <motion.div
                  className={`p-4 rounded-2xl relative overflow-hidden ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-neon-purple to-neon-purple/80 text-white'
                      : 'glass-card border border-glass-border'
                  }`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    boxShadow: message.sender === 'user' 
                      ? '0 0 20px rgba(139, 92, 246, 0.3)' 
                      : '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className="text-sm leading-relaxed">
                        <p>{message.content}</p>

                        {message.schema && (
                            <ul className="mt-2 space-y-1">
                                {Object.entries(message.schema).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' 
                      ? 'text-white/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Message glow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: message.sender === 'user' 
                        ? 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent)' 
                        : 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05), transparent)',
                      filter: 'blur(10px)'
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Thinking Indicator */}
        {aiThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <Robot3DAvatar size="sm" isThinking={true} expression="processing" />
              <div className="glass-card border border-glass-border p-4 rounded-2xl backdrop-blur-20">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-neon-green rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
        {/* Input Area */}
        <div className="glass-card border-t border-glass-border p-4 flex-shrink-0 relative z-10">
            {isDone ? (
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={handleConfirmYes}
                        disabled={yesSubmitting}
                        className="bg-neon-green text-white hover:bg-neon-green/90"
                    >
                        {yesSubmitting ? "Submitting..." : "Yes"}
                    </Button>

                    <Button
                        onClick={() => onNavigate("upload-file")}
                        variant="destructive"
                    >
                        No
                    </Button>
                </div>
            ) : (
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={sessionId ? "Type your answer..." : "Setting things up…"}
                            className="pr-12 bg-input-background border-glass-border focus:border-neon-green/50 focus:ring-neon-green/20"
                            disabled={aiThinking || !sessionId}
                            style={{ backdropFilter: 'blur(10px)' }}
                        />
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || aiThinking || !sessionId}
                        className="h-10 w-10 p-0 bg-gradient-to-r from-neon-green to-neon-green/80 hover:from-neon-green/90 hover:to-neon-green/70"
                        style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccess}
        onComplete={handleSuccessComplete}
        title="Form Processing Complete!"
        message="Your form has been successfully processed and is ready for review."
      />
    </div>
  );
}