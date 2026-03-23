import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import {
  Ear, RotateCcw, Tablet, QrCode, Mail, Play,
  Users, Clock, ShieldCheck, Wifi, WifiOff, ArrowRight
} from "lucide-react";

// Simple QR code display (text-based representation since we don't have a QR library)
function QRCodeDisplay({ url }: { url: string }) {
  return (
    <div
      className="bg-white p-4 rounded-md border-2 border-border inline-block"
      data-testid="qr-code-display"
    >
      {/* Simplified QR visual placeholder with the URL */}
      <div className="w-40 h-40 bg-white flex flex-col items-center justify-center gap-2 relative overflow-hidden">
        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-foreground rounded-sm" />
        <div className="absolute top-0 right-0 w-10 h-10 border-4 border-foreground rounded-sm" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-4 border-foreground rounded-sm" />
        {/* Grid pattern */}
        <div className="grid grid-cols-8 gap-0.5 w-24 h-24">
          {Array.from({ length: 64 }, (_, i) => (
            <div
              key={i}
              className="rounded-[1px]"
              style={{
                backgroundColor: Math.random() > 0.5 ? "#1a1a1a" : "#ffffff",
                width: "12px",
                height: "12px",
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2 max-w-[160px] break-all">
        {url}
      </p>
    </div>
  );
}

function SessionStats({ sessions }: { sessions: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center p-4 bg-card rounded-md border border-card-border" data-testid="stat-sessions">
        <Users className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-2xl font-bold text-foreground">{sessions}</p>
        <p className="text-xs text-muted-foreground">Sessions today</p>
      </div>
      <div className="text-center p-4 bg-card rounded-md border border-card-border" data-testid="stat-time">
        <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
        <p className="text-2xl font-bold text-foreground">~3</p>
        <p className="text-xs text-muted-foreground">Avg. minutes</p>
      </div>
      <div className="text-center p-4 bg-card rounded-md border border-card-border" data-testid="stat-secure">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-foreground">100%</p>
        <p className="text-xs text-muted-foreground">Data secure</p>
      </div>
    </div>
  );
}

export default function StoreMode() {
  const { toast } = useToast();
  const [isStoreMode, setIsStoreMode] = useState(false);
  const [staffPin, setStaffPin] = useState("");
  const [pinEntry, setPinEntry] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [emailForResult, setEmailForResult] = useState("");
  const [resultId, setResultId] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const STORE_PIN = "1234"; // In production, this would be configurable
  const screeningUrl = `${window.location.origin}/screening`;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Load sessions from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem("hearwell-sessions");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setSessionsToday(data.count);
      }
    }
  }, []);

  const incrementSession = () => {
    const today = new Date().toDateString();
    const newCount = sessionsToday + 1;
    setSessionsToday(newCount);
    localStorage.setItem("hearwell-sessions", JSON.stringify({ date: today, count: newCount }));
  };

  const handleActivateStoreMode = () => {
    if (pinEntry === STORE_PIN) {
      setIsStoreMode(true);
      setPinError(false);
      toast({
        title: "Store Mode activated",
        description: "The device is ready for customer use.",
      });
    } else {
      setPinError(true);
      setPinEntry("");
    }
  };

  const handleReset = () => {
    incrementSession();
    setShowQR(false);
    setEmailForResult("");
    setResultId("");
    toast({
      title: "Session cleared",
      description: "Ready for the next customer.",
    });
  };

  const handleSendEmail = async () => {
    if (!emailForResult || !resultId) {
      toast({
        title: "Missing information",
        description: "Please enter both an email address and a result ID.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/send-results-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId, email: emailForResult, name: "Customer" }),
      });
      if (res.ok) {
        toast({
          title: "Email sent",
          description: `Results sent to ${emailForResult}`,
        });
        setEmailForResult("");
        setResultId("");
      }
    } catch {
      toast({
        title: "Send failed",
        description: "Could not send email. Check connection.",
        variant: "destructive",
      });
    }
  };

  // Lock screen / PIN entry
  if (!isStoreMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top bar */}
        <nav className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-store-logo">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <Ear className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">HearWell</span>
              </div>
            </Link>
            <Badge variant="secondary">
              <Tablet className="w-3 h-3 mr-1" />
              Store Mode
            </Badge>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Tablet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Staff Access</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your store PIN to activate Store Mode
              </p>
            </div>

            <Card className="border-card-border text-left">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Store PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={pinEntry}
                    onChange={(e) => {
                      setPinEntry(e.target.value);
                      setPinError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleActivateStoreMode();
                    }}
                    className={pinError ? "border-destructive" : ""}
                    data-testid="input-store-pin"
                  />
                  {pinError && (
                    <p className="text-xs text-destructive" data-testid="text-pin-error">
                      Incorrect PIN. Please try again.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Demo PIN: 1234</p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleActivateStoreMode}
                  data-testid="button-activate-store"
                >
                  Activate Store Mode
                </Button>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Store mode enables quick session resets, QR code display, and on-the-spot email results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Store Mode Dashboard
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Store mode top bar */}
      <div className="bg-primary text-primary-foreground py-3 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary-foreground/20 flex items-center justify-center">
              <Ear className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">HearWell — Store Mode</span>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {isOnline ? (
                <><Wifi className="w-3 h-3 mr-1" />Online</>
              ) : (
                <><WifiOff className="w-3 h-3 mr-1" />Offline</>
              )}
            </Badge>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsStoreMode(false)}
            data-testid="button-exit-store-mode"
          >
            Exit Store Mode
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Stats */}
        <SessionStats sessions={sessionsToday} />

        {/* Main action buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Start new session */}
          <Card className="border-card-border" data-testid="card-start-session">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Start Customer Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Launch the screening flow for a customer. Walk them through the test together or hand them the device.
              </p>
              <Link href="/screening">
                <Button className="w-full" data-testid="button-launch-screening">
                  Launch Screening
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="border-card-border" data-testid="card-qr-code">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                QR Code for Self-Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Show this QR code so customers can complete the screening on their own phone.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQR(!showQR)}
                data-testid="button-toggle-qr"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </Button>
              {showQR && (
                <div className="flex justify-center pt-2">
                  <QRCodeDisplay url={screeningUrl} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email results */}
        <Card className="border-card-border" data-testid="card-email-results">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Results to Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              After a customer completes their screening, send them a copy of their results by email.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="result-id">Result ID (from results page)</Label>
                <Input
                  id="result-id"
                  placeholder="e.g. abc-123-def"
                  value={resultId}
                  onChange={(e) => setResultId(e.target.value)}
                  data-testid="input-result-id"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="customer-email">Customer email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="customer@example.com"
                  value={emailForResult}
                  onChange={(e) => setEmailForResult(e.target.value)}
                  data-testid="input-customer-email"
                />
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSendEmail}
              data-testid="button-send-results-email"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Results Email
            </Button>
          </CardContent>
        </Card>

        {/* Quick reset */}
        <Card className="border-card-border border-destructive/30" data-testid="card-reset">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <RotateCcw className="w-4 h-4 text-destructive" />
              Quick Session Reset
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Wipe the current session and return to a clean state, ready for the next customer. This clears locally stored data only.
            </p>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive"
              onClick={handleReset}
              data-testid="button-reset-session"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Session
            </Button>
          </CardContent>
        </Card>

        {/* Store mode instructions */}
        <Card className="border-card-border bg-primary/5 border-primary/20" data-testid="card-instructions">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Staff Guide
            </h3>
            <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
              <li>Launch the screening for a customer or hand them the device</li>
              <li>For remote completion, show the QR code for them to scan with their own phone</li>
              <li>On the results page, note the result ID to email a copy later</li>
              <li>Use "Email Results" to send the results to the customer's inbox</li>
              <li>Press "Reset Session" between customers to clear any data</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
