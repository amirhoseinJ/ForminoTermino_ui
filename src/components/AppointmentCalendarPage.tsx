import { ArrowLeft, Plus, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../types/navigation";

interface AppointmentCalendarPageProps {
    onNavigate: (page: Page) => void;
}

interface Appointment {
    id: string;
    title: string;
    provider: string;
    date: string;
    time: string;
    location: string;
    status: "confirmed" | "pending" | "completed";
    type: "medical" | "dental" | "other";
}

export default function AppointmentCalendarPage({ onNavigate }: AppointmentCalendarPageProps) {
    // Keep in case you plan to add month navigation later
    const [_selectedMonth] = useState(new Date());

    /**
     * Temporary helper until the `Page` union is updated to include
     * "appointment-booking" and "dashboard". Casting ensures type safety
     * without changing the central `Page` type in this file.
     */
    const navigate = (page: "appointment-booking" | "dashboard") =>
        onNavigate(page as unknown as Page);

    const appointments: Appointment[] = [
        {
            id: "1",
            title: "General Medical Consultation",
            provider: "Dr. Smith",
            date: "2025-08-05",
            time: "9:00 AM",
            location: "Downtown Medical Center",
            status: "confirmed",
            type: "medical",
        },
        {
            id: "2",
            title: "Dental Cleaning",
            provider: "Dr. Johnson",
            date: "2025-08-12",
            time: "2:30 PM",
            location: "Smile Dental Clinic",
            status: "confirmed",
            type: "dental",
        },
        {
            id: "3",
            title: "Follow-up Consultation",
            provider: "Dr. Williams",
            date: "2025-08-18",
            time: "10:15 AM",
            location: "Westside Clinic",
            status: "pending",
            type: "medical",
        },
        {
            id: "4",
            title: "Annual Physical",
            provider: "Dr. Davis",
            date: "2025-08-25",
            time: "11:00 AM",
            location: "Health Plus Center",
            status: "confirmed",
            type: "medical",
        },
    ];

    // Simple calendar grid for August 2025
    const calendarDays = [] as {
        date: Date;
        day: number;
        hasAppointment: boolean;
        isCurrentMonth: boolean;
        isToday: boolean;
    }[];

    const firstDay = new Date(2025, 7, 1); // August 1, 2025
    // @ts-ignore
    const lastDay = new Date(2025, 7, 31); // August 31, 2025 — (reserved for future use)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    for (let i = 0; i < 42; i++) {
        // 6 weeks * 7 days
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const hasAppointment = appointments.some(
            (apt) => new Date(apt.date).toDateString() === currentDate.toDateString()
        );

        const isCurrentMonth = currentDate.getMonth() === 7; // August
        const isToday = currentDate.toDateString() === new Date().toDateString();

        calendarDays.push({
            date: currentDate,
            day: currentDate.getDate(),
            hasAppointment,
            isCurrentMonth,
            isToday,
        });
    }

    const getStatusColor = (status: Appointment["status"]) => {
        switch (status) {
            case "confirmed":
                return "bg-success/10 text-success";
            case "pending":
                return "bg-warning/10 text-warning";
            case "completed":
                return "bg-muted text-muted-foreground";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    const getTypeIcon = (type: Appointment["type"]) => {
        switch (type) {
            case "medical":
                return "🏥";
            case "dental":
                return "🦷";
            default:
                return "📅";
        }
    };

    const upcomingAppointments = appointments
        .filter((apt) => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b px-4 py-3 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate("dashboard")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-lg">My Calendar</h1>
                            <p className="text-xs text-muted-foreground">August 2025</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="bg-soft-green hover:bg-soft-green/90"
                        onClick={() => navigate("appointment-booking")}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Book
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Calendar Grid */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => (
                                <motion.div
                                    key={index}
                                    className={`
                    aspect-square flex items-center justify-center text-sm relative cursor-pointer
                    rounded-lg transition-colors duration-200
                    ${day.isCurrentMonth ? "hover:bg-accent" : "text-muted-foreground/50"}
                    ${day.isToday ? "bg-primary text-primary-foreground" : ""}
                  `}
                                    whileHover={{ scale: day.isCurrentMonth ? 1.05 : 1 }}
                                    whileTap={{ scale: day.isCurrentMonth ? 0.95 : 1 }}
                                >
                                    <span>{day.day}</span>
                                    {day.hasAppointment && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-soft-green rounded-full" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate("appointment-booking")}>
                            View All
                        </Button>
                    </div>

                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingAppointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="hover:shadow-md transition-shadow duration-200">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="text-2xl">{getTypeIcon(appointment.type)}</div>
                                                    <div className="flex-1 space-y-1">
                                                        <h4 className="font-medium">{appointment.title}</h4>
                                                        <p className="text-sm text-muted-foreground">with {appointment.provider}</p>

                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <CalendarIcon className="h-3 w-3" />
                                                                {new Date(appointment.date).toLocaleDateString()}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {appointment.time}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <MapPin className="h-3 w-3" />
                                                            {appointment.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h4 className="font-medium mb-2">No upcoming appointments</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Book your first appointment to get started
                                </p>
                                <Button className="bg-soft-green hover:bg-soft-green/90" onClick={() => navigate("appointment-booking")}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Book Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <Card>
                        <CardContent className="p-3 text-center">
                            <div className="text-lg font-medium text-primary">4</div>
                            <div className="text-xs text-muted-foreground">This Month</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-3 text-center">
                            <div className="text-lg font-medium text-success">3</div>
                            <div className="text-xs text-muted-foreground">Confirmed</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-3 text-center">
                            <div className="text-lg font-medium text-warning">1</div>
                            <div className="text-xs text-muted-foreground">Pending</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
