import { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode } from 'react';

// Language Context
export type Language = 'en' | 'de' | 'ar' | 'es';
export type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Landing Page
    'landing.title': 'Mein Genie',
    'landing.subtitle': 'Your AI-Powered Super Assistant',
    'landing.formino': 'Formino',
    'landing.formino.subtitle': 'Form Assistant',
    'landing.termino': 'Termino',
    'landing.termino.subtitle': 'Appointment Booker',
    'landing.signin': 'Tap to Sign In or Register',
    
    // Authentication
    'auth.title': 'Welcome to Mein Genie',
    'auth.subtitle': 'Sign in to access your AI assistant',
    'auth.google': 'Continue with Google',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.or': 'or',
    
    // Main Hub
    'hub.title': 'Mein Genie',
    'hub.subtitle': 'Your AI Super Assistant',
    'hub.status': 'All services ready • AI powered • Secure & Private',
    
    // Formino
    'formino.title': 'Formino',
    'formino.subtitle': 'AI Form Assistant',
    'formino.welcome': 'How can I help you today?',
    'formino.scan': 'Scan Document',
    'formino.scan.desc': 'Camera scan',
    'formino.upload': 'Upload File',
    'formino.upload.desc': 'PDF or image',
    'formino.link': 'Submit a Link',
    'formino.link.desc': 'Web form URL',
    'formino.consulting': 'Book a meeting with a consultant through Termino',
    'formino.consulting.suggestion': 'I can help you get expert assistance with this. Would you like me to schedule a consultation?',
    
    // Termino
    'termino.title': 'Termino',
    'termino.subtitle': 'AI Appointment Assistant',
    'termino.welcome': 'Hello! I\'m Termino',
    'termino.description': 'I\'ll help you schedule your appointments quickly and easily',
    'termino.voice': 'Live Voice',
    'termino.voice.desc': 'Speak directly to me and I\'ll understand your request',
    'termino.upload': 'Upload Voice',
    'termino.upload.desc': 'Upload a pre-recorded audio file with your request',
    'termino.text': 'Text Input',
    'termino.text.desc': 'Type your appointment request in detail',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
    'common.calendar': 'Calendar',
  },
  de: {
    // Landing Page
    'landing.title': 'Mein Genie',
    'landing.subtitle': 'Ihr KI-gestützter Super-Assistent',
    'landing.formino': 'Formino',
    'landing.formino.subtitle': 'Formular-Assistent',
    'landing.termino': 'Termino',
    'landing.termino.subtitle': 'Terminbuchung',
    'landing.signin': 'Zum Anmelden tippen',
    
    // Authentication
    'auth.title': 'Willkommen bei Mein Genie',
    'auth.subtitle': 'Melden Sie sich an, um auf Ihren KI-Assistenten zuzugreifen',
    'auth.google': 'Mit Google fortfahren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.signin': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.or': 'oder',
    
    // Main Hub
    'hub.title': 'Mein Genie',
    'hub.subtitle': 'Ihr KI Super-Assistent',
    'hub.status': 'Alle Dienste bereit • KI-gestützt • Sicher & Privat',
    
    // Formino
    'formino.title': 'Formino',
    'formino.subtitle': 'KI-Formular-Assistent',
    'formino.welcome': 'Wie kann ich Ihnen heute helfen?',
    'formino.scan': 'Dokument scannen',
    'formino.scan.desc': 'Kamera-Scan',
    'formino.upload': 'Datei hochladen',
    'formino.upload.desc': 'PDF oder Bild',
    'formino.link': 'Link übermitteln',
    'formino.link.desc': 'Web-Formular URL',
    'formino.consulting': 'Termin mit einem Berater über Termino buchen',
    'formino.consulting.suggestion': 'Ich kann Ihnen dabei helfen, fachkundige Unterstützung zu erhalten. Möchten Sie, dass ich eine Beratung plane?',
    
    // Termino
    'termino.title': 'Termino',
    'termino.subtitle': 'KI-Termin-Assistent',
    'termino.welcome': 'Hallo! Ich bin Termino',
    'termino.description': 'Ich helfe Ihnen dabei, Ihre Termine schnell und einfach zu planen',
    'termino.voice': 'Live-Sprache',
    'termino.voice.desc': 'Sprechen Sie direkt mit mir und ich verstehe Ihre Anfrage',
    'termino.upload': 'Sprache hochladen',
    'termino.upload.desc': 'Laden Sie eine voraufgezeichnete Audiodatei mit Ihrer Anfrage hoch',
    'termino.text': 'Texteingabe',
    'termino.text.desc': 'Tippen Sie Ihre Terminanfrage im Detail',
    
    // Common
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.save': 'Speichern',
    'common.profile': 'Profil',
    'common.settings': 'Einstellungen',
    'common.calendar': 'Kalender',
  },
  ar: {
    // Landing Page
    'landing.title': 'مين جيني',
    'landing.subtitle': 'مساعدك الذكي المدعوم بالذكاء الاصطناعي',
    'landing.formino': 'فورمينو',
    'landing.formino.subtitle': 'مساعد النماذج',
    'landing.termino': 'تيرمينو',
    'landing.termino.subtitle': 'حجز المواعيد',
    'landing.signin': 'اضغط لتسجيل الدخول',
    
    // Authentication
    'auth.title': 'مرحباً بك في مين جيني',
    'auth.subtitle': 'سجل الدخول للوصول إلى مساعدك الذكي',
    'auth.google': 'المتابعة مع جوجل',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.signin': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.or': 'أو',
    
    // Main Hub
    'hub.title': 'مين جيني',
    'hub.subtitle': 'مساعدك الذكي الفائق',
    'hub.status': 'جميع الخدمات جاهزة • مدعوم بالذكاء الاصطناعي • آمن وخاص',
    
    // Formino
    'formino.title': 'فورمينو',
    'formino.subtitle': 'مساعد النماذج الذكي',
    'formino.welcome': 'كيف يمكنني مساعدتك اليوم؟',
    'formino.scan': 'مسح المستند',
    'formino.scan.desc': 'مسح بالكاميرا',
    'formino.upload': 'رفع ملف',
    'formino.upload.desc': 'PDF أو صورة',
    'formino.link': 'إرسال رابط',
    'formino.link.desc': 'رابط نموذج ويب',
    'formino.consulting': 'حجز اجتماع مع مستشار عبر تيرمينو',
    'formino.consulting.suggestion': 'يمكنني مساعدتك في الحصول على مساعدة خبيرة في هذا الأمر. هل تريد مني جدولة استشارة؟',
    
    // Termino
    'termino.title': 'تيرمينو',
    'termino.subtitle': 'مساعد المواعيد الذكي',
    'termino.welcome': 'مرحباً! أنا تيرمينو',
    'termino.description': 'سأساعدك في جدولة مواعيدك بسرعة وسهولة',
    'termino.voice': 'صوت مباشر',
    'termino.voice.desc': 'تحدث معي مباشرة وسأفهم طلبك',
    'termino.upload': 'رفع ملف صوتي',
    'termino.upload.desc': 'قم برفع ملف صوتي مسجل مسبقاً مع طلبك',
    'termino.text': 'إدخال نص',
    'termino.text.desc': 'اكتب طلب موعدك بالتفصيل',
    
    // Common
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.profile': 'الملف الشخصي',
    'common.settings': 'الإعدادات',
    'common.calendar': 'التقويم',
  },
  es: {
    // Landing Page
    'landing.title': 'Mein Genie',
    'landing.subtitle': 'Tu Super Asistente Potenciado por IA',
    'landing.formino': 'Formino',
    'landing.formino.subtitle': 'Asistente de Formularios',
    'landing.termino': 'Termino',
    'landing.termino.subtitle': 'Reserva de Citas',
    'landing.signin': 'Toca para Iniciar Sesión',
    
    // Authentication
    'auth.title': 'Bienvenido a Mein Genie',
    'auth.subtitle': 'Inicia sesión para acceder a tu asistente IA',
    'auth.google': 'Continuar con Google',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.signin': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.or': 'o',
    
    // Main Hub
    'hub.title': 'Mein Genie',
    'hub.subtitle': 'Tu Super Asistente IA',
    'hub.status': 'Todos los servicios listos • Potenciado por IA • Seguro y Privado',
    
    // Formino
    'formino.title': 'Formino',
    'formino.subtitle': 'Asistente IA de Formularios',
    'formino.welcome': '¿Cómo puedo ayudarte hoy?',
    'formino.scan': 'Escanear Documento',
    'formino.scan.desc': 'Escaneo con cámara',
    'formino.upload': 'Subir Archivo',
    'formino.upload.desc': 'PDF o imagen',
    'formino.link': 'Enviar Enlace',
    'formino.link.desc': 'URL de formulario web',
    'formino.consulting': 'Reservar una reunión con un consultor a través de Termino',
    'formino.consulting.suggestion': 'Puedo ayudarte a obtener asistencia experta con esto. ¿Te gustaría que programe una consulta?',
    
    // Termino
    'termino.title': 'Termino',
    'termino.subtitle': 'Asistente IA de Citas',
    'termino.welcome': '¡Hola! Soy Termino',
    'termino.description': 'Te ayudaré a programar tus citas de manera rápida y fácil',
    'termino.voice': 'Voz en Vivo',
    'termino.voice.desc': 'Habla directamente conmigo y entenderé tu solicitud',
    'termino.upload': 'Subir Voz',
    'termino.upload.desc': 'Sube un archivo de audio pregrabado con tu solicitud',
    'termino.text': 'Entrada de Texto',
    'termino.text.desc': 'Escribe tu solicitud de cita en detalle',
    
    // Common
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.profile': 'Perfil',
    'common.settings': 'Configuración',
    'common.calendar': 'Calendario',
  }
};

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    t
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}