import { ArrowLeft, Check, Crown, Zap, Phone, Calendar, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Page } from "../types/navigation";

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const freeFeatures = [
    "Basic form assistance",
    "5 appointments per month",
    "Standard support",
    "Basic templates",
    "Email notifications"
  ];

  const proFeatures = [
    "Advanced AI form completion",
    "Unlimited appointments",
    "Automated phone calls",
    "Priority support",
    "Premium templates",
    "SMS & Email notifications",
    "Advanced analytics",
    "Custom integrations",
    "Bulk operations"
  ];

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
          <h1 className="text-xl font-medium">Pricing</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-2xl mb-2">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Upgrade to unlock premium features and boost your productivity
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-4">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  Free Plan
                </CardTitle>
                <Badge variant="secondary">Current</Badge>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary/50 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Pro Plan
              </CardTitle>
              <div className="space-y-1">
                <div className="text-2xl font-bold">$19</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                    {feature.includes("Automated phone calls") && (
                      <Phone className="h-4 w-4 text-primary ml-1" />
                    )}
                    {feature.includes("Unlimited appointments") && (
                      <Calendar className="h-4 w-4 text-primary ml-1" />
                    )}
                  </div>
                ))}
              </div>
              <Button className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pro Features Highlight */}
        <Card className="bg-accent/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              Why Go Pro?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Automated Phone Calls</div>
                  <div className="text-sm text-muted-foreground">
                    AI-powered phone calls for appointment confirmations and follow-ups
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Unlimited Appointments</div>
                  <div className="text-sm text-muted-foreground">
                    Schedule as many appointments as you need without restrictions
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Advanced AI Features</div>
                  <div className="text-sm text-muted-foreground">
                    Get the most sophisticated AI assistance for all your tasks
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money Back Guarantee */}
        <div className="text-center py-4 text-sm text-muted-foreground">
          <p>30-day money-back guarantee • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}