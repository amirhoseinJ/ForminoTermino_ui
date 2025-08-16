import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import type { Page } from "../types/navigation";

interface AppointmentSlotsPageProps {
    onNavigate: (page: Page) => void;
}

interface TimeSlot {
    id: string;
    date: string;
    time: string;
    location: string;
    provider: string;
    available: boolean;
    duration: string;
}

export default function AppointmentSlotsPage({ onNavigate }: AppointmentSlotsPageProps) {
    /**
     * Local helper to navigate while keeping the compiler happy until
     * the central `Page` union is expanded to include these routes.
     */
    const navigate = (page: "appointment-booking" | "appointment-confirmation") =>
        onNavigate(page as unknown as Page);

    const timeSlots: TimeSlot[] = [
        {
            id: "1",
            date: "Monday, Aug 5",
            time: "9:00 AM",
            location: "Downtown Medical Center",
            provider: "Dr. Smith",
            available: true,
            duration: "30 min",
        },
        {
            id: "2",
            date: "Monday, Aug 5",
            time: "2:30 PM",
            location: "Downtown Medical Center",
            provider: "Dr. Johnson",
            available: true,
            duration: "45 min",
        },
        {
            id: "3",
            date: "Tuesday, Aug 6",
            time: "10:15 AM",
            location: "Westside Clinic",
            provider: "Dr. Williams",
            available: true,
            duration: "30 min",
        },
        {
            id: "4",
            date: "Tuesday, Aug 6",
            time: "3:45 PM",
            location: "Downtown Medical Center",
            provider: "Dr. Smith",
            available: true,
            duration: "30 min",
        },
        {
            id: "5",
            date: "Wednesday, Aug 7",
            time: "11:00 AM",
            location: "Eastside Medical",
            provider: "Dr. Davis",
            available: false,
            duration: "30 min",
        },
        {
            id: "6",
            date: "Wednesday, Aug 7",
            time: "4:00 PM",
            location: "Westside Clinic",
            provider: "Dr. Miller",
            available: true,
            duration: "45 min",
        },
    ];

    const handleSelectSlot = (slot: TimeSlot) => {
        console.log("Selected slot:", slot);
        navigate("appointment-confirmation");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b px-4 py-3 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate("appointment-booking")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-lg">Available Appointments</h1>
                        <p className="text-xs text-muted-foreground">Doctor's appointment - Next 7 days</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Search Summary */}
                <div className="bg-calm-blue/20 p-4 rounded-lg">
                    <p className="text-sm">
                        Found {timeSlots.filter((slot) => slot.available).length} available appointments for your request
                    </p>
                </div>

                {/* Time Slots */}
                <div className="space-y-3">
                    {timeSlots.map((slot, index) => (
                        <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`overflow-hidden transition-all duration-200 ${
                                    slot.available
                                        ? "hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary cursor-pointer"
                                        : "opacity-60 bg-muted/30"
                                }`}
                                onClick={() => slot.available && handleSelectSlot(slot)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 space-y-2">
                                            {/* Date and Time */}
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{slot.date}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {slot.time} ({slot.duration})
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Location and Provider */}
                                            <div className="flex items-start gap-3">
                                                <div className="bg-soft-green/10 p-2 rounded-lg">
                                                    <MapPin className="h-4 w-4 text-soft-green" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{slot.provider}</p>
                                                    <p className="text-sm text-muted-foreground">{slot.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            {slot.available ? (
                                                <>
                                                    <Badge variant="secondary" className="bg-success/10 text-success">
                                                        Available
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        className="bg-soft-green hover:bg-soft-green/90"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectSlot(slot);
                                                        }}
                                                    >
                                                        Select
                                                    </Button>
                                                </>
                                            ) : (
                                                <Badge variant="outline" className="opacity-60">
                                                    Booked
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Show More */}
                <div className="text-center pt-4">
                    <Button variant="outline">Show More Dates</Button>
                </div>

                {/* Help Text */}
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                        Tap any available slot to book your appointment. You'll receive a confirmation email and calendar invite.
                    </p>
                </div>
            </div>
        </div>
    );
}
