import { useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion, AnimatePresence } from "motion/react";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";

interface TerminoSelfBookingPageProps {
    onNavigate: (page: Page) => void;
}

const API_BASE = import.meta.env.BASE_URL

export default function TerminoSelfBookingPage({ onNavigate }: TerminoSelfBookingPageProps) {
    // Form state
    const [apptType, setApptType] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [providerName, setProviderName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    // Duration (default 1 hour like TerminoCalendar)
    const [duration, setDuration] = useState<{ hours: string; minutes: string }>({
        hours: "1",
        minutes: "0",
    });

    // Submitting + toast states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // ----- API config (mirrors TerminoCalendar.tsx) -----
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const minutesFrom = (h: string, m: string, defaultMinutes = 60) => {
        const hi = parseInt(h, 10);
        const mi = parseInt(m, 10);
        const hours = isNaN(hi) ? 0 : Math.max(0, hi);
        const mins = isNaN(mi) ? 0 : Math.max(0, mi);
        let total = hours * 60 + mins;
        if (total <= 0) total = defaultMinutes;
        return total;
    };

    // Combine date + time -> ISO(no Z), same approach as TerminoCalendar
    function toIsoRange(selectedDate: string, timeHHMM: string, minutes = 60) {
        const [h, m] = timeHHMM.split(":").map(Number);
        const startLocal = new Date(selectedDate);
        startLocal.setHours(h, m ?? 0, 0, 0);
        const endLocal = new Date(startLocal.getTime() + minutes * 60 * 1000);
        const toLocalIsoNoZ = (d: Date) =>
            new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .replace("Z", "");
        return { startIso: toLocalIsoNoZ(startLocal), endIso: toLocalIsoNoZ(endLocal) };
    }

    const googleSync = async () => {
        if (!token) return;
        try {
            await fetch(`${API_BASE}/google/sync/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // swallow
        }
    };

    const handleAddToCalendar = async () => {
        const requiredMissing = [];
        if (!title) requiredMissing.push("Appointment Title");
        if (!date) requiredMissing.push("Date");
        if (!time) requiredMissing.push("Time");
        if (requiredMissing.length) {
            alert(`Please fill the required fields: ${requiredMissing.join(", ")}`);
            return;
        }
        if (!token) {
            alert("You are not authenticated. Please sign in to add to your calendar.");
            return;
        }

        setIsSubmitting(true);

        // Build description by combining fields as requested
        const combinedDescription = [
            "Type of Appointment:",
            apptType || "",
            "",
            "Provider/Doctor Name:",
            providerName || "",
            "",
            "Phone Number:",
            phone || "",
            "",
            "Additional Notes:",
            notes || "",
        ].join("\n");

        try {
            const minutes = minutesFrom(duration.hours, duration.minutes, 60);
            const { startIso, endIso } = toIsoRange(date, time, minutes);

            // Create in local calendar
            const res = await fetch(`${API_BASE}/events/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    start_iso: startIso,
                    end_iso: endIso,
                    location: location || "",
                    description: combinedDescription,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to create event");
            }

            // Sync to Google
            await googleSync();

            // Success toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (e: any) {
            alert(`Failed to add to calendar: ${e?.message || e}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Make the native time/date picker indicator visible on dark UIs */}
            <style>
                {`
          input[type="time"]::-webkit-calendar-picker-indicator,
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            opacity: 1;
          }
          input[type="time"]::-moz-focus-inner { border: 0; }
          input[type="date"]::-moz-focus-inner,
          input[type="time"]::-moz-focus-inner { border: 0; }
        `}
            </style>

            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Subtle Background */}
                <SubtleAnimatedBackground variant="minimal" />

                {/* Header */}
                <div className="glass-card relative z-10 px-4 py-3 border-b border-glass-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onNavigate("termino")}
                                className="hover:bg-glass-bg hover:text-neon-green"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-lg text-foreground">Self-Guided Booking</h1>
                                <p className="text-xs text-muted-foreground">Quickly capture appointment details</p>
                            </div>
                        </div>

                        <UnifiedGenieAvatar size="sm" expression="happy" glowColor="green" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                    {/* Title */}
                    <div className="max-w-3xl mx-auto mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-2">Appointment Details</h2>
                        <p className="text-sm text-muted-foreground">
                            Fill in the details below and I’ll get it onto your calendar.
                        </p>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card max-w-3xl mx-auto rounded-2xl p-5 border border-glass-border"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Type of Appointment */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">Type of Appointment</label>
                                <Select value={apptType} onValueChange={setApptType}>
                                    <SelectTrigger className="bg-input-background border-glass-border">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Doctor">Doctor</SelectItem>
                                        <SelectItem value="Dentist">Dentist</SelectItem>
                                        <SelectItem value="Government">Government</SelectItem>
                                        <SelectItem value="Lawyer">Lawyer</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Appointment Title * */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">
                                    Appointment Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g., Dental Checkup"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Provider/Doctor Name */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">Provider/Doctor Name</label>
                                <Input
                                    placeholder="e.g., Dr. Smith"
                                    value={providerName}
                                    onChange={(e) => setProviderName(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
                                <Input
                                    placeholder="+49 xxx xxx xxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Date * */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Time * */}
                            <div className="col-span-1">
                                <label className="text-xs text-muted-foreground mb-1 block">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Duration (like TerminoCalendar) */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs text-muted-foreground mb-1 block">
                                    Duration
                                    <span className="text-xs text-muted-foreground ml-2">
                                        (default 1 hour if left 0)
                                    </span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            value={duration.hours}
                                            onChange={(e) => setDuration((p) => ({ ...p, hours: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                        <span className="text-sm text-muted-foreground">hours</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={59}
                                            step={1}
                                            value={duration.minutes}
                                            onChange={(e) => setDuration((p) => ({ ...p, minutes: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                        <span className="text-sm text-muted-foreground">minutes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location/Address */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs text-muted-foreground mb-1 block">Location/Address</label>
                                <Input
                                    placeholder="Street address, city"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            {/* Additional Notes */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs text-muted-foreground mb-1 block">Additional Notes</label>
                                <textarea
                                    rows={4}
                                    placeholder="Any special instructions, documents to bring, etc."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-md bg-input-background border border-glass-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neon-green/40"
                                />
                            </div>
                        </div>

                        {/* Add to Calendar */}
                        <div className="mt-5">
                            <Button
                                onClick={handleAddToCalendar}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Add to Calendar"
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    {/* What I'll do for you */}
                    <div className="max-w-3xl mx-auto mt-6">
                        <div className="glass-card rounded-2xl p-5 border border-glass-border">
                            <h3 className="text-sm font-semibold text-foreground mb-3">What I'll do for you:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-neon-green" />
                                    <span>Add to personal calendar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-neon-green" />
                                    <span>Sync with Google Calendar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-neon-green" />
                                    <span>Check for conflicts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-neon-green" />
                                    <span>Telegram reminders and events list</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Toast */}
                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="glass-card border-glass-border rounded-full px-4 py-2 text-sm flex items-center gap-2 shadow-lg">
                                <Check className="h-4 w-4 text-neon-green" />
                                <span>Added to Calendar!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}