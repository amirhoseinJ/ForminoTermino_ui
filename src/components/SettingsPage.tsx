import { ArrowLeft, Bell, Globe, ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import type { Page } from "../types/navigation";

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    marketing: false
  });

  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/*/!* Upgrade to Pro *!/*/}
        {/*<Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">*/}
        {/*  <CardContent className="p-4">*/}
        {/*    <Button*/}
        {/*      onClick={() => onNavigate('pricing')}*/}
        {/*      className="w-full h-auto p-4 bg-primary hover:bg-primary/90"*/}
        {/*    >*/}
        {/*      <div className="flex items-center justify-between w-full">*/}
        {/*        <div className="flex items-center gap-3">*/}
        {/*          <Crown className="h-6 w-6 text-primary-foreground" />*/}
        {/*          <div className="text-left">*/}
        {/*            <div className="font-medium text-primary-foreground">Upgrade to Pro Plan</div>*/}
        {/*            <div className="text-sm text-primary-foreground/80">*/}
        {/*              Unlock premium features*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*        <ChevronRight className="h-5 w-5 text-primary-foreground" />*/}
        {/*      </div>*/}
        {/*    </Button>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}

        {/* Notifications */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Get updates via email
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive text messages for important updates
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Communications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive promotional emails
                  </div>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Theme */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Language & Theme</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">Language</div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium mb-3">Account</h3>
            
            <Button variant="ghost" className="w-full justify-between h-auto p-3">
              <span>Privacy Policy</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between h-auto p-3">
              <span>Terms of Service</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between h-auto p-3 text-destructive">
              <span>Sign Out</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}