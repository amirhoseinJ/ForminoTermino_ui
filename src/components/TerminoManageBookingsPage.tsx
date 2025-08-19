import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Phone,
    MessageSquare,
    Trash2,
    Share,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";

interface TerminoManageBookingsPageProps {
    onNavigate: (page: Page) => void;
}

// Shape we expect from the events API (based on TerminoCalendar.tsx usage)
interface CalendarEventApi {
    id: string;
    title: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    location?: string;
    description?: string;
    type?: "ai-booked" | "manual" | "google-sync";
    provider?: string;
    category?: string; // could act as "Appointment Type"
    start_iso?: string; // may or may not be present; used to compute duration
    end_iso?: string; // may or may not be present; used to compute duration
}

interface AppointmentView {
    id: string;
    title: string;
    provider?: string;
    date: string;
    time: string;
    location?: string;
    phone?: string;
    notes?: string;
    apptType?: string;
    durationMinutes?: number;
    dateTime: Date;
    raw: CalendarEventApi;
}

type RescheduleForm = {
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    durationHours: string;
    durationMinutes: string;
    location: string;
    description: string;
};


const API_BASE = import.meta.env.VITE_API_BASE

export default function TerminoManageBookingsPage({
                                                      onNavigate,
                                                  }: TerminoManageBookingsPageProps) {
    const [events, setEvents] = useState<CalendarEventApi[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

    // Reschedule modal state
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentView | null>(null);
    const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>({
        title: "",
        date: "",
        time: "",
        durationHours: "1",
        durationMinutes: "0",
        location: "",
        description: "",
    });
    const [isSavingReschedule, setIsSavingReschedule] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // --- Helpers ---
    const buildRangeISO = () => {
        const now = new Date();
        const start = new Date(Date.UTC(now.getFullYear() - 1, 0, 1, 0, 0, 0));
        const end = new Date(Date.UTC(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999));
        return { from: start.toISOString(), to: end.toISOString() };
        // Using UTC to match TerminoCalendar style
    };

    const googleSync = async () => {
        if (!token) return;
        try {
            await fetch(`${API_BASE}/google/sync/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // ignore sync errors silently
        }
    };

    const fetchAllEvents = async () => {
        if (!token) return [];
        const { from, to } = buildRangeISO();
        const res = await fetch(
            `${API_BASE}/events/list/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()) as CalendarEventApi[];
    };

    function parseDescription(desc?: string): {
        apptType?: string;
        providerName?: string;
        phone?: string;
        notes?: string;
    } {
        if (!desc) return {};
        const map: Record<string, keyof ReturnType<typeof parseDescription>> = {
            "type of appointment:": "apptType",
            "provider/doctor name:": "providerName",
            "phone number:": "phone",
            "additional notes:": "notes",
        };

        const lines = desc.split(/\r?\n/);
        let currentKey: keyof ReturnType<typeof parseDescription> | null = null;
        const acc: any = {};
        let matchedAnyLabel = false;

        for (const rawLine of lines) {
            const line = rawLine.trim();
            const lower = line.toLowerCase();
            const found = Object.keys(map).find((k) => lower.startsWith(k));
            if (found) {
                matchedAnyLabel = true;
                currentKey = map[found];
                // Capture any text after the label on the same line (if present)
                const after = line.slice(found.length).trim();
                acc[currentKey] = after ? after : "";
                continue;
            }
            if (currentKey) {
                // Append additional lines until next label
                const existing = acc[currentKey] || "";
                acc[currentKey] = existing ? `${existing}\n${line}` : line;
            }
        }

        // Trim values
        for (const key of Object.keys(acc)) {
            if (typeof acc[key] === "string") acc[key] = acc[key].trim();
        }

        // If we didn't match any known labels, treat the whole description as notes
        if (!matchedAnyLabel) {
            return { notes: desc };
        }

        return acc;
    }

    function durationFromIso(e: CalendarEventApi): number | undefined {
        if (e.start_iso && e.end_iso) {
            const start = new Date(e.start_iso).getTime();
            const end = new Date(e.end_iso).getTime();
            if (!isNaN(start) && !isNaN(end) && end > start) {
                return Math.round((end - start) / 60000);
            }
        }
        // Not available; return undefined
        return undefined;
    }

    function toAppointmentViews(apiEvents: CalendarEventApi[]): AppointmentView[] {
        return apiEvents.map((e) => {
            const parsed = parseDescription(e.description);
            const dt = new Date(`${e.date}T${e.time}`);
            return {
                id: e.id,
                title: e.title,
                provider: e.provider || parsed.providerName,
                date: e.date,
                time: e.time,
                location: e.location,
                phone: parsed.phone,
                notes: parsed.notes, // will be raw description if not parseable
                apptType: e.category || parsed.apptType,
                durationMinutes: durationFromIso(e),
                dateTime: dt,
                raw: e,
            };
        });
    }

    function formatDuration(mins?: number): string {
        if (!mins || mins <= 0) return "--";
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h && m) return `${h}h ${m}m`;
        if (h && !m) return `${h}h`;
        return `${m}m`;
    }

    function safeDurationMinutes(mins?: number): number {
        const n = Number(mins);
        if (isNaN(n) || n <= 0) return 60; // default 1 hour if missing
        return n;
    }

    // Build start and end ms for a given appointment
    function apptRangeMs(appt: AppointmentView): { start: number; end: number } {
        const start = appt.dateTime.getTime();
        const dur = safeDurationMinutes(appt.durationMinutes) * 60000;
        return { start, end: start + dur };
    }

    // --- Data load + periodic refresh (every 6s) ---
    useEffect(() => {
        let isMounted = true;

        const initialLoad = async () => {
            try {
                await googleSync();
            } catch {
                // ignore
            }
            try {
                const data = await fetchAllEvents();
                if (isMounted) setEvents(data);
            } catch {
                // silently ignore errors for now
            } finally {
                if (isMounted) setIsInitialLoading(false);
            }
        };

        // Run initial load with "loading" state
        initialLoad();

        // Then refresh silently every 6s (no loading spinner to avoid flicker)
        const id = setInterval(async () => {
            try {
                const data = await fetchAllEvents();
                if (isMounted) setEvents(data);
            } catch {
                // ignore
            }
        }, 6000);

        return () => {
            isMounted = false;
            clearInterval(id);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // --- Derived lists: upcoming vs past ---
    const { upcomingAppointments, pastAppointments } = useMemo(() => {
        const all = toAppointmentViews(events).filter((a) => !isNaN(a.dateTime.getTime()));
        const now = new Date();
        const upcoming = all
            .filter((a) => a.dateTime.getTime() >= now.getTime())
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
        const past = all
            .filter((a) => a.dateTime.getTime() < now.getTime())
            .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
        return { upcomingAppointments: upcoming, pastAppointments: past };
    }, [events]);

    // --- Overlap detection for upcoming appointments only ---
    const overlappingIds = useMemo(() => {
        const ids = new Set<string>();
        if (upcomingAppointments.length === 0) return ids;

        type R = { id: string; start: number; end: number };
        const ranges: R[] = upcomingAppointments.map((a) => {
            const { start, end } = apptRangeMs(a);
            return { id: a.id, start, end };
        });

        // Sort by start time
        ranges.sort((a, b) => a.start - b.start);

        // Sweep line: active intervals where end > current.start
        let active: R[] = [];
        for (const cur of ranges) {
            // Remove non-overlapping from active
            active = active.filter((x) => x.end > cur.start);

            // Any remaining in active overlap with current
            if (active.length > 0) {
                ids.add(cur.id);
                for (const x of active) ids.add(x.id);
            }

            // Add current to active
            active.push(cur);
        }
        return ids;
    }, [upcomingAppointments]);

    // --- Actions ---
    const handleDeleteAppointment = async (id: string) => {
        if (!token) {
            alert("You are not authenticated. Please sign in.");
            return;
        }
        const confirmed = window.confirm("Delete this appointment?");
        if (!confirmed) return;

        setDeletingId(id);
        try {
            const res = await fetch(`${API_BASE}/events/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(await res.text());
            // refresh after delete
            const data = await fetchAllEvents();
            setEvents(data);
        } catch (e: any) {
            alert(`Failed to delete: ${e?.message || e}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleShareAppointment = (appointment: AppointmentView) => {
        const shareText = `📅 ${appointment.title}
🏢 ${appointment.provider || "--"}
📍 ${appointment.location || "--"}
🕐 ${new Date(appointment.date).toLocaleDateString("en-GB")} at ${appointment.time}
⏱️ ${formatDuration(appointment.durationMinutes)}
📌 Type: ${appointment.apptType || "--"}`;

        if ((navigator as any).share) {
            (navigator as any).share({
                title: appointment.title,
                text: shareText,
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            // optionally, show a toast
        }
    };

    // Reschedule helpers
    const minutesFrom = (h: string, m: string, defaultMinutes = 60) => {
        const hi = parseInt(h, 10);
        const mi = parseInt(m, 10);
        const hours = isNaN(hi) ? 0 : Math.max(0, hi);
        const mins = isNaN(mi) ? 0 : Math.max(0, mi);
        let total = hours * 60 + mins;
        if (total <= 0) total = defaultMinutes;
        return total;
    };

    function toIsoRange(selectedDate: string, timeHHMM: string, minutes = 60) {
        const [h, m] = timeHHMM.split(":").map(Number);
        const startLocal = new Date(selectedDate);
        startLocal.setHours(h, m ?? 0, 0, 0);
        const endLocal = new Date(startLocal.getTime() + minutes * 60 * 1000);
        const toLocalIsoNoZ = (d: Date) =>
            new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().replace("Z", "");
        return { startIso: toLocalIsoNoZ(startLocal), endIso: toLocalIsoNoZ(endLocal) };
    }

    const openRescheduleModal = (appt: AppointmentView) => {
        setRescheduleTarget(appt);
        setRescheduleForm({
            title: appt.title,
            date: appt.date,
            time: appt.time,
            durationHours: String(Math.floor(safeDurationMinutes(appt.durationMinutes) / 60)),
            durationMinutes: String(safeDurationMinutes(appt.durationMinutes) % 60),
            location: appt.location || "",
            description: appt.raw.description || "",
        });
        setIsRescheduleOpen(true);
    };

    const closeRescheduleModal = () => {
        if (isSavingReschedule) return;
        setIsRescheduleOpen(false);
        setRescheduleTarget(null);
    };

    const handleSaveReschedule = async () => {
        if (!token || !rescheduleTarget) {
            alert("You are not authenticated or no appointment selected.");
            return;
        }
        const reqMinutes = minutesFrom(rescheduleForm.durationHours, rescheduleForm.durationMinutes, 60);
        const { startIso, endIso } = toIsoRange(rescheduleForm.date, rescheduleForm.time, reqMinutes);

        setIsSavingReschedule(true);
        try {
            const res = await fetch(`${API_BASE}/events/${rescheduleTarget.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: rescheduleForm.title,
                    start_iso: startIso,
                    end_iso: endIso,
                    location: rescheduleForm.location || "",
                    description: rescheduleForm.description ?? "",
                }),
            });
            if (!res.ok) throw new Error(await res.text());

            // sync and refresh
            try {
                await googleSync();
            } catch {
                // ignore sync failures
            }
            const data = await fetchAllEvents();
            setEvents(data);

            setIsRescheduleOpen(false);
            setRescheduleTarget(null);
        } catch (e: any) {
            alert(`Failed to reschedule: ${e?.message || e}`);
        } finally {
            setIsSavingReschedule(false);
        }
    };

    const renderAppointmentCard = (appointment: AppointmentView, index: number, isOverlapping: boolean) => (
        <motion.div
            key={appointment.id}
            className="glass-card rounded-xl p-4 border border-glass-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {isOverlapping && (
                            <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Overlapping appointment" />
                        )}
                        <h3 className={`font-semibold ${isOverlapping ? "text-red-500" : "text-foreground"}`}>
                            {appointment.title}
                        </h3>
                    </div>
                    {appointment.provider && (
                        <p className="text-sm text-muted-foreground mb-2">{appointment.provider}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString("en-GB")}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{appointment.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {formatDuration(appointment.durationMinutes)}</span>
                </div>

                {appointment.apptType && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Appointment Type: {appointment.apptType}</span>
                    </div>
                )}

                {appointment.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                    </div>
                )}

                {appointment.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.phone}</span>
                    </div>
                )}

                {appointment.notes && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mt-0.5" />
                        <span className="whitespace-pre-wrap">{appointment.notes}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {appointment.phone && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-glass-border hover:bg-glass-bg"
                        onClick={() => window.open(`tel:${appointment.phone}`)}
                    >
                        <Phone className="h-4 w-4" />
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="border-glass-border hover:bg-glass-bg"
                    onClick={() => handleShareAppointment(appointment)}
                >
                    <Share className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="border-glass-border hover:bg-glass-bg"
                    disabled={deletingId === appointment.id}
                    onClick={() => handleDeleteAppointment(appointment.id)}
                >
                    {deletingId === appointment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {isOverlapping && (
                <div className="mt-4">
                    <Button
                        onClick={() => openRescheduleModal(appointment)}
                        className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-500/90 hover:to-red-600/90"
                    >
                        Reschedule
                    </Button>
                </div>
            )}
        </motion.div>
    );

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

            <div
                className="min-h-dvh md:min-h-screen relative overflow-x-hidden overflow-y-auto flex flex-col"
                style={{
                    background:
                        "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
                }}
            >

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
                                className="hover:bg-glass-bg hover:text-neon-purple"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-lg text-foreground">Manage Appointments</h1>
                                <p className="text-xs text-muted-foreground">Track and organize your bookings</p>
                            </div>
                        </div>

                        <UnifiedGenieAvatar size="sm" expression="happy" glowColor="purple" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                    {/* Welcome Section */}
                    <div className="text-center mb-8">
                        <UnifiedGenieAvatar size="lg" expression="success" glowColor="purple" className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">Your Appointment Calendar</h2>
                    </div>

                    {isInitialLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mb-3" />
                            <p>Loading your appointments…</p>
                        </div>
                    ) : (
                        <>
                            {/* Upcoming Appointments */}
                            {upcomingAppointments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Appointments</h3>
                                    <div className="space-y-4">
                                        {upcomingAppointments.map((appointment, index) =>
                                            renderAppointmentCard(appointment, index, overlappingIds.has(appointment.id))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Past Appointments */}
                            {pastAppointments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Past Appointments</h3>
                                    <div className="space-y-4">
                                        {pastAppointments.map((appointment, index) =>
                                            renderAppointmentCard(appointment, index, false)
                                        )}
                                    </div>
                                </div>
                            )}

                            {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
                                <div className="text-center py-8">
                                    <UnifiedGenieAvatar size="md" expression="neutral" glowColor="blue" className="mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">
                                        No appointments yet. Add your existing bookings to get started!
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Reschedule Modal */}
                <AnimatePresence>
                    {isRescheduleOpen && rescheduleTarget && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={closeRescheduleModal}
                                aria-hidden="true"
                            />
                            <motion.div
                                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 12, opacity: 0, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                                className="relative glass-card w-full sm:max-w-lg mx-2 sm:mx-0 rounded-2xl border border-glass-border p-5"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="reschedule-title"
                            >
                                <h3 id="reschedule-title" className="text-lg font-semibold text-foreground mb-2">
                                    Reschedule Appointment
                                </h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Update the date, time, duration, or notes. I’ll adjust your calendar and re-sync with Google.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                                        <Input
                                            value={rescheduleForm.title}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, title: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                                        <Input
                                            type="date"
                                            value={rescheduleForm.date}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, date: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs text-muted-foreground mb-1 block">Time</label>
                                        <Input
                                            type="time"
                                            value={rescheduleForm.time}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, time: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs text-muted-foreground mb-1 block">Duration (hours)</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            value={rescheduleForm.durationHours}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, durationHours: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs text-muted-foreground mb-1 block">Duration (minutes)</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={59}
                                            step={1}
                                            value={rescheduleForm.durationMinutes}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, durationMinutes: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-xs text-muted-foreground mb-1 block">Location/Address</label>
                                        <Input
                                            value={rescheduleForm.location}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, location: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                            placeholder="Street address, city"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-xs text-muted-foreground mb-1 block">Notes / Description</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Any details about this appointment..."
                                            value={rescheduleForm.description}
                                            onChange={(e) => setRescheduleForm((p) => ({ ...p, description: e.target.value }))}
                                            className="w-full rounded-md bg-input-background border border-glass-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neon-green/40"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        className="border-glass-border hover:bg-glass-bg"
                                        onClick={closeRescheduleModal}
                                        disabled={isSavingReschedule}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveReschedule}
                                        disabled={isSavingReschedule}
                                        className="bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
                                    >
                                        {isSavingReschedule ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving…
                                            </>
                                        ) : (
                                            "Save changes"
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}