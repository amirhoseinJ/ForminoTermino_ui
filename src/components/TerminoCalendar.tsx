import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    ArrowLeft,
    Pencil,
    Trash2,
    Loader2,
    CloudUpload,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useApp } from "./contexts/AppContext";
import type { Page } from "../types/navigation.ts";

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    location?: string;
    description?: string;
    type: "ai-booked" | "manual" | "google-sync";
    provider?: string;
    category?: string;
    // Returned by server when listing events
    start_iso?: string; // ISO with timezone
    end_iso?: string;   // ISO with timezone
}

interface TerminoCalendarProps {
    onEventSelect?: (event: CalendarEvent) => void;
    onNavigate: (page: Page) => void;
}

const API_BASE = import.meta.env.BASE_URL



export default function TerminoCalendar({ onEventSelect, onNavigate }: TerminoCalendarProps) {
    const { t } = useApp();
    // Used to prevent overlapping polls
    const isFetchingRef = useRef(false);
    // ---------- State ----------
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    // Create dialog
    const [showEventDialog, setShowEventDialog] = useState(false);

    // Day list dialog
    const [dayEventsOpen, setDayEventsOpen] = useState(false);

    // Edit dialog
    const [editingOpen, setEditingOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Create form states
    const [newEvent, setNewEvent] = useState({
        title: "",
        time: "",
        location: "",
        description: "",
    });

    // New duration: default to 1 hour
    const [newDuration, setNewDuration] = useState<{ hours: string; minutes: string }>({
        hours: "1",
        minutes: "0",
    });

    // Edit form states
    const [editForm, setEditForm] = useState({
        title: "",
        time: "",
        location: "",
        description: "",
    });

    // Edit duration: we will prefill from server start_iso/end_iso
    const [editDuration, setEditDuration] = useState<{ hours: string; minutes: string }>({
        hours: "",
        minutes: "",
    });
    const [editDurationTouched, setEditDurationTouched] = useState(false);

    // submitting states
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Google sync states
    const [syncingId, setSyncingId] = useState<string | null>(null);
    const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // ---------- Utilities ----------
    const minutesFrom = (h: string, m: string, defaultMinutes = 60) => {
        const hi = parseInt(h, 10);
        const mi = parseInt(m, 10);
        const hours = isNaN(hi) ? 0 : Math.max(0, hi);
        const mins = isNaN(mi) ? 0 : Math.max(0, mi);
        let total = hours * 60 + mins;
        if (total <= 0) total = defaultMinutes;
        return total;
    };

    const durationMinutesFromIso = (startIso?: string, endIso?: string): number | null => {
        if (!startIso || !endIso) return null;
        const start = new Date(startIso).getTime();
        const end = new Date(endIso).getTime();
        if (isNaN(start) || isNaN(end)) return null;
        const diff = Math.max(0, Math.round((end - start) / 60000));
        return diff;
    };

    const splitHM = (totalMinutes: number) => {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return { h, m };
    };

    const formatDuration = (totalMinutes?: number | null) => {
        if (totalMinutes == null) return null;
        const { h, m } = splitHM(totalMinutes);
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h}h`;
        return `${m}m`;
    };

    // ---------- Data load & sync ----------
    function monthRangeISO(date: Date) {
        const y = date.getFullYear();
        const m = date.getMonth();
        const start = new Date(Date.UTC(y, m, 1, 0, 0, 0));
        const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
        return { from: start.toISOString(), to: end.toISOString() };
    }

    async function fetchEventsForMonth(date: Date): Promise<CalendarEvent[]> {
        if (!token) return [];
        const { from, to } = monthRangeISO(date);
        const res = await fetch(
            `${API_BASE}/events/list/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (!res.ok) return [];
        return res.json();
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

    // Check Google connection status (optional but helps with clearer errors)
    async function fetchGoogleStatus() {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/google/status/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const j = await res.json();
                setGoogleConnected(!!j?.connected);
            } else {
                setGoogleConnected(null);
            }
        } catch {
            setGoogleConnected(null);
        }
    }

    // Attempt to sync a single event to Google
    async function syncEventToGoogle(eventId: string) {
        if (!token) {
            alert("Not authenticated.");
            return;
        }
        setSyncingId(eventId);
        try {
            // If we already know it's not connected, fail fast with a clear error
            if (googleConnected === false) {
                throw new Error("Google Calendar is not connected.");
            }

            // Try a targeted endpoint first
            let res = await fetch(`${API_BASE}/events/${eventId}/sync-google/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fallback to a generic sync endpoint that accepts an event_id
            if (!res.ok) {
                res = await fetch(`${API_BASE}/google/sync/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ event_id: eventId }),
                });
            }

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to sync to Google.");
            }

            // Refresh the list after a successful sync
            const fresh = await fetchEventsForMonth(currentDate);
            setCalendarEvents(fresh);

            // Update Google connection status (in case it changes externally)
            fetchGoogleStatus();
        } catch (e: any) {
            const msg = String(e?.message || e);
            if (msg.toLowerCase().includes("not connected") || msg.toLowerCase().includes("connect")) {
                alert("Google Calendar is not connected. Please connect your Google Calendar and try again.");
            } else {
                alert(`Sync failed: ${msg}`);
            }
        } finally {
            setSyncingId(null);
        }
    }

    useEffect(() => {
        fetchEventsForMonth(currentDate).then(setCalendarEvents).catch(() => {});
    }, [currentDate]);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/google/sync/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
            .finally(() =>
                fetchEventsForMonth(currentDate).then(setCalendarEvents).catch(() => {})
            );
    }, [currentDate, token]);

    //  auto refresh
    // useEffect(() => {
    //     if (!token) return;
    //     const syncGoogle = () =>
    //         fetch(`${API_BASE}/google/sync/`, {
    //             method: "POST",
    //             headers: { Authorization: `Bearer ${token}` },
    //         }).then(() => fetchEventsForMonth(currentDate).then(setCalendarEvents));
    //     syncGoogle();
    //     const id = setInterval(syncGoogle, 20000);
    //     return () => clearInterval(id);
    // }, [token, currentDate]);








    // fetch Google connection status once
    useEffect(() => {
        fetchGoogleStatus();
    }, [token]);

    // ---------- Helpers ----------
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    };

    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const getEventsForDate = (dateString: string) =>
        calendarEvents.filter((e) => e.date === dateString);

    const formatSelectedDate = (ds: string) =>
        new Date(ds).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    // combine date + time -> ISO(no Z)
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

    // ---------- API for edit/delete ----------
    async function updateEventApi(
        id: string,
        patch: Partial<CalendarEvent> & { minutes?: number }
    ) {
        if (!token) throw new Error("Not authenticated");
        const base = calendarEvents.find((e) => e.id === id);
        let start_iso: string | undefined;
        let end_iso: string | undefined;

        const timeChanged = !!patch.time && base?.time !== patch.time;
        const dateChanged = !!patch.date && base?.date !== patch.date;
        const minutesProvided = typeof patch.minutes === "number";

        if (base && (timeChanged || dateChanged || minutesProvided)) {
            const date = patch.date ?? base.date;
            const time = patch.time ?? base.time;
            const existingMins =
                durationMinutesFromIso(base.start_iso, base.end_iso) ?? 60;
            const mins = minutesProvided ? patch.minutes! : existingMins;
            const { startIso, endIso } = toIsoRange(date, time, mins);
            start_iso = startIso;
            end_iso = endIso;
        }

        const res = await fetch(`${API_BASE}/events/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: patch.title,
                location: patch.location,
                description: patch.description,
                date: patch.date, // optional: keep if backend accepts
                time: patch.time, // optional: keep if backend accepts
                start_iso,
                end_iso,
            }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async function deleteEventApi(id: string) {
        if (!token) throw new Error("Not authenticated");
        const res = await fetch(`${API_BASE}/events/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
    }

    // ---------- Click handlers ----------
    const handleDateClick = (day: number) => {
        if (!day) return;
        const dateString = formatDate(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        setSelectedDate(dateString);
        setDayEventsOpen(true);
    };

    const handleEventClick = (evt: CalendarEvent) => {
        setEditingEvent(evt);
        setEditForm({
            title: evt.title,
            time: evt.time,
            location: evt.location || "",
            description: evt.description || "",
        });

        // Prefill duration from server start/end
        const mins = durationMinutesFromIso(evt.start_iso, evt.end_iso);
        if (mins != null) {
            const { h, m } = splitHM(mins);
            setEditDuration({ hours: String(h), minutes: String(m) });
        } else {
            setEditDuration({ hours: "", minutes: "" });
        }
        setEditDurationTouched(false);

        setEditingOpen(true);
        onEventSelect?.(evt);
    };

    // Keep edit form in sync when the editing event changes or modal opens
    useEffect(() => {
        if (editingOpen && editingEvent) {
            setEditForm({
                title: editingEvent.title,
                time: editingEvent.time,
                location: editingEvent.location || "",
                description: editingEvent.description || "",
            });

            const mins = durationMinutesFromIso(editingEvent.start_iso, editingEvent.end_iso);
            if (mins != null) {
                const { h, m } = splitHM(mins);
                setEditDuration({ hours: String(h), minutes: String(m) });
            } else {
                setEditDuration({ hours: "", minutes: "" });
            }
            setEditDurationTouched(false);
        }
    }, [editingOpen, editingEvent]);

    // ---------- Create ----------
    const handleCreateEvent = async () => {
        if (!selectedDate || !newEvent.title || !newEvent.time) return;
        setIsCreating(true);

        // duration
        const minutes = minutesFrom(newDuration.hours, newDuration.minutes, 60);

        // optimistic
        const optimistic: CalendarEvent = {
            id: `tmp-${Date.now()}`,
            title: newEvent.title,
            date: selectedDate,
            time: newEvent.time,
            location: newEvent.location,
            description: newEvent.description,
            type: "manual",
        };
        setCalendarEvents((prev) => [...prev, optimistic]);

        try {
            const { startIso, endIso } = toIsoRange(selectedDate, newEvent.time, minutes);
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${API_BASE}/events/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newEvent.title,
                    start_iso: startIso,
                    end_iso: endIso,
                    location: newEvent.location || "",
                    description: newEvent.description || "",
                    // timezone: "Asia/Dubai",
                }),
            });
            if (!res.ok) throw new Error(await res.text());

            // Google sync before returning
            await googleSync();

            // refresh month data
            const fresh = await fetchEventsForMonth(currentDate);
            setCalendarEvents(fresh);

            setShowEventDialog(false);
            setNewEvent({ title: "", time: "", location: "", description: "" });
            setNewDuration({ hours: "1", minutes: "0" });
        } catch (e: any) {
            setCalendarEvents((prev) => prev.filter((ev) => ev.id !== optimistic.id));
            alert(`Failed to create event: ${e?.message || e}`);
        } finally {
            setIsCreating(false);
        }
    };

    // ---------- Edit ----------
    const submitEdit = async () => {
        if (!editingEvent) return;
        setIsEditing(true);
        try {
            const patch: Partial<CalendarEvent> & { minutes?: number } = {
                title: editForm.title,
                time: editForm.time,
                location: editForm.location,
                description: editForm.description,
                date: editingEvent.date,
            };

            if (editDurationTouched) {
                patch.minutes = minutesFrom(editDuration.hours, editDuration.minutes, 60);
            }

            await updateEventApi(editingEvent.id, patch);

            // Google sync before updating UI
            await googleSync();

            const fresh = await fetchEventsForMonth(currentDate);
            setCalendarEvents(fresh);
            setEditingOpen(false);
            setEditingEvent(null);
        } catch (e: any) {
            alert(`Failed to update: ${e?.message || e}`);
        } finally {
            setIsEditing(false);
        }
    };

    // ---------- Delete ----------
    const deleteEditing = async () => {
        if (!editingEvent) return;
        if (!confirm("Delete this event?")) return;
        setIsDeleting(true);
        try {
            await deleteEventApi(editingEvent.id);
            const fresh = await fetchEventsForMonth(currentDate);
            setCalendarEvents(fresh);
            setEditingOpen(false);
            setEditingEvent(null);
        } catch (e: any) {
            alert(`Failed to delete: ${e?.message || e}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Separate remove handler for lists (without opening edit modal)
    const removeEventFromList = async (event: CalendarEvent) => {
        if (!confirm("Delete this event?")) return;
        setDeletingId(event.id);
        try {
            await deleteEventApi(event.id);
            const fresh = await fetchEventsForMonth(currentDate);
            setCalendarEvents(fresh);
        } catch (e: any) {
            alert(`Failed to delete: ${e?.message || e}`);
        } finally {
            setDeletingId(null);
        }
    };

    // ---------- Derived ----------
    const days = getDaysInMonth(currentDate);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

    const eventsForSelectedDate = useMemo(
        () =>
            selectedDate
                ? getEventsForDate(selectedDate).sort(
                    (a, b) =>
                        new Date(a.date + "T" + a.time).getTime() -
                        new Date(b.date + "T" + b.time).getTime()
                )
                : [],
        [selectedDate, calendarEvents]
    );





    // Auto-refresh just the events list every 5s (no Google sync)
    useEffect(() => {
        if (!token) return;

        let alive = true;

        const poll = async () => {
            if (document.hidden) return;          // pause when tab hidden
            if (isFetchingRef.current) return;    // no overlap
            isFetchingRef.current = true;
            try {
                const fresh = await fetchEventsForMonth(currentDate);
                if (alive) setCalendarEvents(fresh);
            } catch {
                // swallow; keep polling
            } finally {
                isFetchingRef.current = false;
            }
        };

        // kick off + interval
        poll();
        const id = setInterval(poll, 5000);

        // refresh on focus / visibility change
        const onFocus = () => poll();
        const onVisibility = () => { if (!document.hidden) poll(); };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            alive = false;
            clearInterval(id);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [token, currentDate]); // don't put useRef or functions here







    // ---------- UI ----------
    return (
        <>
            {/* Make the native time/date picker indicator visible on dark UIs */}
            <style>{`
        input[type="time"]::-webkit-calendar-picker-indicator,
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 1;
        }
        input[type="time"]::-moz-focus-inner { border: 0; }
        input[type="date"]::-moz-focus-inner,
        input[type="time"]::-moz-focus-inner { border: 0; }
      `}</style>

            {/* Header */}
            <div className="glass-card glass-glow-green relative z-10 px-4 py-4 border-b border-glass-border mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onNavigate("termino")}
                                className="hover:bg-glass-bg hover:text-neon-green"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </motion.div>
                        <div>
                            <h1 className="text-lg text-foreground">{t("termino.title")}</h1>
                            <p className="text-xs text-muted-foreground">Calendar</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <motion.div
                className="w-full max-w-4xl mx-auto mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Calendar Header */}
                <div className="glass-card rounded-2xl border border-glass-border p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Select
                                value={currentMonth.toString()}
                                onValueChange={(v) => setCurrentDate(new Date(currentYear, parseInt(v), 1))}
                            >
                                <SelectTrigger className="w-40 bg-input-background border-glass-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m, i) => (
                                        <SelectItem key={m} value={i.toString()}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={currentYear.toString()}
                                onValueChange={(v) => setCurrentDate(new Date(parseInt(v), currentMonth, 1))}
                            >
                                <SelectTrigger className="w-24 bg-input-background border-glass-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))}
                                    className="w-10 h-10 p-0 rounded-full hover:bg-neon-purple/10 hover:text-neon-purple"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}
                                    className="w-10 h-10 p-0 rounded-full hover:bg-neon-purple/10 hover:text-neon-purple"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {daysOfWeek.map((d) => (
                            <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, idx) => {
                            const dateString = day ? formatDate(currentYear, currentMonth, day) : "";
                            const dayEvents = day ? getEventsForDate(dateString) : [];
                            const isToday =
                                !!day &&
                                dateString ===
                                formatDate(
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate()
                                );

                            return (
                                <motion.div
                                    key={idx}
                                    className={`aspect-square p-2 rounded-lg cursor-pointer relative overflow-hidden ${
                                        day
                                            ? `hover:bg-glass-bg border border-glass-border ${
                                                isToday ? "bg-neon-purple/20 border-neon-purple/50" : ""
                                            }`
                                            : "pointer-events-none"
                                    }`}
                                    onClick={() => day && handleDateClick(day)}
                                    whileHover={day ? { scale: 1.05 } : {}}
                                    whileTap={day ? { scale: 0.95 } : {}}
                                >
                                    {day && (
                                        <>
                                            <div
                                                className={`text-sm font-medium ${
                                                    isToday ? "text-neon-purple" : "text-foreground"
                                                }`}
                                            >
                                                {day}
                                            </div>

                                            {dayEvents.length > 0 && (
                                                <div className="absolute bottom-1 left-1 right-1 flex gap-1 flex-wrap">
                                                    {dayEvents.slice(0, 2).map((e, i) => (
                                                        <motion.div
                                                            key={e.id}
                                                            className={`w-2 h-2 rounded-full ${
                                                                e.type === "ai-booked"
                                                                    ? "bg-neon-green"
                                                                    : e.type === "google-sync"
                                                                        ? "bg-blue-500"
                                                                        : "bg-neon-purple"
                                                            }`}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            whileHover={{ scale: 1.5 }}
                                                        />
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            +{dayEvents.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {isToday && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-lg border-2 border-neon-purple/30"
                                                    animate={{
                                                        borderColor: [
                                                            "rgba(139,92,246,0.3)",
                                                            "rgba(139,92,246,0.6)",
                                                            "rgba(139,92,246,0.3)",
                                                        ],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming */}
                <AnimatePresence>
                    {calendarEvents.length > 0 && (
                        <motion.div
                            className="glass-card rounded-2xl border border-glass-border p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-neon-green" />
                                    Upcoming Events
                                </h3>
                                {selectedDate && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowEventDialog(true)}
                                        className="border-glass-border hover:bg-glass-bg"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New on {new Date(selectedDate).toLocaleDateString()}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {calendarEvents
                                    .filter((e) => new Date(e.date + "T" + e.time) >= new Date())
                                    .sort(
                                        (a, b) =>
                                            new Date(a.date + "T" + a.time).getTime() -
                                            new Date(b.date + "T" + b.time).getTime()
                                    )
                                    .slice(0, 5)
                                    .map((event, idx) => {
                                        const mins = durationMinutesFromIso(event.start_iso, event.end_iso);
                                        const durationLabel = formatDuration(mins);
                                        const showSync = event.type !== "google-sync";
                                        return (
                                            <motion.div
                                                key={event.id}
                                                className="p-4 glass-card rounded-lg border border-glass-border hover:border-neon-green/30 cursor-pointer group"
                                                onClick={() => handleEventClick(event)}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-foreground group-hover:text-neon-green transition-colors">
                                                                {event.title}
                                                            </h4>
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${
                                                                    event.type === "ai-booked"
                                                                        ? "bg-neon-green"
                                                                        : event.type === "google-sync"
                                                                            ? "bg-blue-500"
                                                                            : "bg-neon-purple"
                                                                }`}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(event.date).toLocaleDateString()} at {event.time}
                                                            </div>
                                                            {durationLabel && (
                                                                <div className="flex items-center gap-1">
                                                                    <span>•</span>
                                                                    <span>{durationLabel}</span>
                                                                </div>
                                                            )}
                                                            {event.location && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {event.location}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {showSync && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={syncingId === event.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    syncEventToGoogle(event.id);
                                                                }}
                                                            >
                                                                {syncingId === event.id ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                        Syncing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CloudUpload className="h-4 w-4 mr-1" />
                                                                        Sync to Google
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEventClick(event);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={deletingId === event.id}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                await removeEventFromList(event);
                                                            }}
                                                        >
                                                            {deletingId === event.id ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                                    Remove
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Day Events Dialog */}
                <Dialog open={dayEventsOpen} onOpenChange={(o) => setDayEventsOpen(o)}>
                    <DialogContent className="glass-card border-glass-border max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDate ? `Events on ${formatSelectedDate(selectedDate)}` : "Events"}
                            </DialogTitle>
                            <DialogDescription>View, edit, or remove your events for this day.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 max-h-[50vh] overflow-auto">
                            {eventsForSelectedDate.length === 0 && (
                                <div className="text-sm text-muted-foreground">No events for this date.</div>
                            )}

                            {eventsForSelectedDate.map((e) => {
                                const showSync = e.type !== "google-sync";
                                return (
                                    <div
                                        key={e.id}
                                        className="p-3 rounded-lg border border-glass-border flex items-start justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">{e.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {e.time} • {e.location || "No location"}
                                            </div>
                                            {e.description && <div className="text-xs mt-1">{e.description}</div>}
                                        </div>
                                        <div className="flex gap-2">
                                            {showSync && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={syncingId === e.id}
                                                    onClick={() => syncEventToGoogle(e.id)}
                                                >
                                                    {syncingId === e.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                            Syncing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CloudUpload className="h-4 w-4 mr-1" />
                                                            Sync to Google
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingEvent(e);
                                                    setEditForm({
                                                        title: e.title,
                                                        time: e.time,
                                                        location: e.location || "",
                                                        description: e.description || "",
                                                    });
                                                    const mins = durationMinutesFromIso(e.start_iso, e.end_iso);
                                                    if (mins != null) {
                                                        const { h, m } = splitHM(mins);
                                                        setEditDuration({ hours: String(h), minutes: String(m) });
                                                    } else {
                                                        setEditDuration({ hours: "", minutes: "" });
                                                    }
                                                    setEditDurationTouched(false);
                                                    setEditingOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={deletingId === e.id}
                                                onClick={async () => {
                                                    await removeEventFromList(e);
                                                }}
                                            >
                                                {deletingId === e.id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setShowEventDialog(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                New Event
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Create Event Dialog */}
                <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                    <DialogContent className="glass-card border-glass-border">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-neon-green" />
                                Create New Event
                            </DialogTitle>
                            <DialogDescription>
                                {selectedDate
                                    ? `Create a new event for ${formatSelectedDate(selectedDate)}`
                                    : "Create a new event for the selected date"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Event Title</label>
                                <Input
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                                    placeholder="Enter event title"
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-1">
                                    <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                    <Input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent((p) => ({ ...p, time: e.target.value }))}
                                        className="bg-input-background border-glass-border"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-foreground mb-2 block">
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
                                                value={newDuration.hours}
                                                onChange={(e) =>
                                                    setNewDuration((p) => ({ ...p, hours: e.target.value }))
                                                }
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
                                                value={newDuration.minutes}
                                                onChange={(e) =>
                                                    setNewDuration((p) => ({ ...p, minutes: e.target.value }))
                                                }
                                                className="bg-input-background border-glass-border"
                                            />
                                            <span className="text-sm text-muted-foreground">minutes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Location (Optional)
                                </label>
                                <Input
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))}
                                    placeholder="Enter location"
                                    className="bg-input-background border-glass-border"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent((p) => ({ ...p, description: e.target.value }))
                                    }
                                    placeholder="Enter description"
                                    className="bg-input-background border-glass-border min-h-20"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowEventDialog(false)}
                                    className="flex-1 border-glass-border hover:bg-glass-bg"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateEvent}
                                    disabled={!newEvent.title || !newEvent.time || isCreating}
                                    className="flex-1 bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Create Event"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit / Remove Dialog */}
                <Dialog open={editingOpen} onOpenChange={setEditingOpen}>
                    <DialogContent className="glass-card border-glass-border">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Pencil className="h-5 w-5 text-neon-green" />
                                Edit Event
                            </DialogTitle>
                            <DialogDescription>Update details or remove this event.</DialogDescription>
                        </DialogHeader>

                        {editingEvent && (
                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Title
                                        </label>
                                        <Input
                                            value={editForm.title}
                                            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                                        <Input
                                            type="date"
                                            value={editingEvent.date}
                                            onChange={(e) =>
                                                setEditingEvent({ ...editingEvent, date: e.target.value } as CalendarEvent)
                                            }
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                        <Input
                                            type="time"
                                            value={editForm.time}
                                            onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Duration
                                            <span className="text-xs text-muted-foreground ml-2">
                        (leave unchanged to keep current)
                      </span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step={1}
                                                    placeholder="1"
                                                    value={editDuration.hours}
                                                    onChange={(e) => {
                                                        setEditDuration((p) => ({ ...p, hours: e.target.value }));
                                                        setEditDurationTouched(true);
                                                    }}
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
                                                    placeholder="0"
                                                    value={editDuration.minutes}
                                                    onChange={(e) => {
                                                        setEditDuration((p) => ({ ...p, minutes: e.target.value }));
                                                        setEditDurationTouched(true);
                                                    }}
                                                    className="bg-input-background border-glass-border"
                                                />
                                                <span className="text-sm text-muted-foreground">minutes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Location
                                        </label>
                                        <Input
                                            value={editForm.location}
                                            onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                                            className="bg-input-background border-glass-border"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Description
                                        </label>
                                        <Textarea
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm((p) => ({ ...p, description: e.target.value }))
                                            }
                                            className="bg-input-background border-glass-border min-h-20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-glass-border hover:bg-glass-bg"
                                        onClick={() => setEditingOpen(false)}
                                        disabled={isEditing || isDeleting}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
                                        onClick={submitEdit}
                                        disabled={isEditing || isDeleting}
                                    >
                                        {isEditing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-500/40 text-red-500 hover:bg-red-500/10"
                                        onClick={deleteEditing}
                                        disabled={isDeleting || isEditing}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </>
    );
}
