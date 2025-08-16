import { ArrowLeft, Calendar, MapPin, Clock, User, FileText, CalendarPlus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../types/navigation";

interface AppointmentConfirmationPageProps {
  onNavigate: (page: Page) => void;
}

export default function AppointmentConfirmationPage({ onNavigate }: AppointmentConfirmationPageProps) {
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const appointmentDetails = {
    service: "General Medical Consultation",
    provider: "Dr. Smith",
    date: "Monday, August 5, 2025",
    time: "9:00 AM - 9:30 AM",
    duration: "30 minutes",
    location: "Downtown Medical Center",
    address: "123 Health Street, Suite 200, City, ST 12345",
    phone: "(555) 123-4567",
    confirmationNumber: "APT-2025-0001"
  };

  const handleConfirmAppointment = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onNavigate('appointment-calendar');
    }, 2000);
  };

  const handleAddToCalendar = () => {
    // Simulate adding to calendar
    alert("Calendar event created successfully!");
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-success/5 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center space-y-6"
        >
          <div className="bg-success/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
            <Check className="h-12 w-12 text-success" />
          </div>
          <div>
            <h2 className="text-2xl mb-2">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">
              You'll receive a confirmation email shortly
            </p>
          </div>
          <Button 
            onClick={() => onNavigate('appointment-calendar')}
            className="bg-soft-green hover:bg-soft-green/90"
          >
            View Calendar
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('appointment-slots')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg">Confirm Appointment</h1>
            <p className="text-xs text-muted-foreground">
              Review details before booking
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Appointment Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Service */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{appointmentDetails.service}</p>
                  <p className="text-sm text-muted-foreground">with {appointmentDetails.provider}</p>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{appointmentDetails.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointmentDetails.time} ({appointmentDetails.duration})
                  </p>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{appointmentDetails.location}</p>
                  <p className="text-sm text-muted-foreground">{appointmentDetails.address}</p>
                  <p className="text-sm text-muted-foreground">{appointmentDetails.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Any special requirements or notes?</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., First time patient, need parking assistance, etc."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Details */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Confirmation Number</span>
                <Badge variant="outline">{appointmentDetails.confirmationNumber}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cancellation Policy</span>
                <span className="text-sm">24 hours notice</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reminder</span>
                <span className="text-sm">Email & SMS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button 
            onClick={handleConfirmAppointment}
            className="w-full h-12 bg-soft-green hover:bg-soft-green/90 text-lg"
          >
            <Check className="mr-2 h-5 w-5" />
            Confirm Appointment
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleAddToCalendar}
            className="w-full"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Please arrive 15 minutes early for check-in. Bring a valid ID and insurance card.
          </p>
        </div>
      </div>
    </div>
  );
}