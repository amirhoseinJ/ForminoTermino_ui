import { useState, useEffect } from "react";
import { AppProvider } from "./components/contexts/AppContext";
import LandingPage from "./components/LandingPage";
import AuthenticationPage from "./components/AuthenticationPage";
import MainHub from "./components/MainHub";
import ForminoMainScreen from "./components/ForminoMainScreen";
import TerminoMainScreen from "./components/TerminoMainScreen";
import TerminoSelfBookingPage from "./components/TerminoSelfBookingPage";
import TerminoManageBookingsPage from "./components/TerminoManageBookingsPage";
import UserProfile from "./components/UserProfile";
import SettingsPage from "./components/SettingsPage";
import PricingPage from "./components/PricingPage";
import FormChatPage from "./components/FormChatPage";
import FormReviewPage from "./components/FormReviewPage";
import AppointmentSlotsPage from "./components/AppointmentSlotsPage";
import AppointmentConfirmationPage from "./components/AppointmentConfirmationPage";
import AppointmentCalendarPage from "./components/AppointmentCalendarPage";
import ScanDocumentPage from "./components/ScanDocumentPage";
import UploadFilePage from "./components/UploadFilePage";
import SubmitLinkPage from "./components/SubmitLinkPage";
import type { Page } from "./types/navigation";
import { Toaster } from 'react-hot-toast'
import TerminoCalendar from "./components/TerminoCalendar.tsx";
import TerminoAiBookingPage from "./components/TerminoAiBooking.tsx";


function AppContent() {
  const [currentPage, setCurrentPage] =
    useState<Page>("landing");
  const [formData, setFormData] = useState<any>(null);

    // On mount, check for accessToken in localStorage
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setCurrentPage("hub");
        } else {
            setCurrentPage("landing");
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setCurrentPage("landing");
    };

    type ReviewData = { pdfUrl?: string; fileName?: string };

    const [reviewData, setReviewData] = useState<ReviewData | null>(null); // NEW

    const handleNavigate = (page: Page, data?: ReviewData) => {
        if (page === "form-review") {
            setReviewData(data ?? null);
        }
        setCurrentPage(page);
    };

  const handleSignIn = () => {
    setCurrentPage("auth");
  };

  const handleAuthenticated = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
          setCurrentPage("hub");
      } else {
          setCurrentPage("landing");
      }
    setCurrentPage("hub");
  };

  const handleScanComplete = (description: string, documentId: string) => {
    setFormData({ description: description, documentId: documentId });
    setCurrentPage("form-chat");
  };

  const handleUploadComplete = (description: string, documentId: string) => {
    setFormData({ description: description, documentId: documentId });
    setCurrentPage("form-chat");
  };

  const handleLinkComplete = (description: string, documentId: string) => {
      setFormData({ description: description, documentId: documentId });
    setCurrentPage("form-chat");
  };

  switch (currentPage) {
    case "landing":
      return <LandingPage onSignIn={handleSignIn} />;
    case "auth":
      return (
        <AuthenticationPage
          onBack={() => setCurrentPage("landing")}
          onAuthenticated={handleAuthenticated}
        />
      );
      case "hub":
          return <MainHub onNavigate={handleNavigate} onLogout={handleLogout}/>;
      case "formino":
          return <ForminoMainScreen onNavigate={handleNavigate}/>;
      case "termino":
          return <TerminoMainScreen onNavigate={handleNavigate}/>;
      case "termino-calendar":
          return <TerminoCalendar onNavigate={handleNavigate}/>;
      case "termino-ai-booking":
          return <TerminoAiBookingPage onNavigate={handleNavigate}/>;
      case "termino-self-booking":
          return <TerminoSelfBookingPage onNavigate={handleNavigate}/>;
      case "termino-manage-bookings":
          return <TerminoManageBookingsPage onNavigate={handleNavigate}/>;


      case "profile":
          return <UserProfile onNavigate={handleNavigate}/>;
      case "settings":
          return <SettingsPage onNavigate={handleNavigate}/>;
      case "pricing":
          return <PricingPage onNavigate={handleNavigate}/>;
      case "scan-document":
          return (
              <ScanDocumentPage
                  onBack={() => setCurrentPage("formino")}
                  onComplete={handleScanComplete}
              />
          );
      case "upload-file":
          return (
              <UploadFilePage
                  onBack={() => setCurrentPage("formino")}
                  onComplete={handleUploadComplete}
              />
          );
      case "submit-link":
          return (
              <SubmitLinkPage
                  onBack={() => setCurrentPage("formino")}
                  onComplete={handleLinkComplete}
              />
          );
      case "form-chat":
          return (
              <FormChatPage
                  onNavigate={handleNavigate}
                  formData={formData}
              />
          );
      case "form-review":
        return (
            <FormReviewPage
                onNavigate={handleNavigate}
                pdfUrl={reviewData?.pdfUrl}
                fileName={reviewData?.fileName}
            />
        );
    case "appointment-slots":
      return (
        <AppointmentSlotsPage onNavigate={handleNavigate} />
      );
    case "appointment-confirmation":
      return (
        <AppointmentConfirmationPage
          onNavigate={handleNavigate}
        />
      );
    case "appointment-calendar":
      return (
        <AppointmentCalendarPage onNavigate={handleNavigate} />
      );
      default:
      return <MainHub onNavigate={handleNavigate} onLogout= {handleLogout} />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
        <Toaster position="bottom-left" />
    </AppProvider>
  );
}