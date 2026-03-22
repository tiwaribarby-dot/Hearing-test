import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  Ear,
  Clock,
  CheckCircle,
  ChevronRight,
  Star,
  Volume2,
  Brain,
  ShieldCheck,
  HeartPulse,
  MapPin,
  CalendarDays,
  BookOpen,
  Tablet,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Ear className="w-6 h-6" />,
    title: "Quick Profile",
    desc: "Answer a few short questions about your lifestyle and hearing history — takes under 2 minutes.",
  },
  {
    num: "02",
    icon: <Volume2 className="w-6 h-6" />,
    title: "Audio & Self-Assessment",
    desc: "Listen to tones across different frequencies and rate how well you hear everyday situations.",
  },
  {
    num: "03",
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Personalised Results",
    desc: "Receive a clear, plain-language summary with visual graphics and tailored next steps.",
  },
];

const features = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "3 minutes",
    subtitle: "Complete the full screen",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Clinically informed",
    subtitle: "Based on validated questions",
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    title: "Personalised",
    subtitle: "Tailored to your age & history",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Science-backed",
    subtitle: "Linked to cognitive health",
  },
];

const testimonials = [
  {
    name: "Margaret T.",
    age: 67,
    quote: "I had no idea my hearing had changed so much. The screen was so simple and the results finally gave me the push I needed to book an appointment.",
    result: "Now fitted with hearing aids",
  },
  {
    name: "David R.",
    age: 58,
    quote: "My wife kept saying I had the TV too loud. The tool confirmed what she'd been saying for years. Very clear and no-nonsense results.",
    result: "Booked a consultation",
  },
  {
    name: "Patricia M.",
    age: 72,
    quote: "The education section on tinnitus was brilliant. I've had ringing for years and never really understood why. Now I'm getting proper help.",
    result: "Tinnitus management started",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Ear className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">HearWell</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Link href="/education">
              <Button variant="ghost" size="sm" data-testid="link-nav-education">
                <BookOpen className="w-4 h-4 mr-1" />
                Learn
              </Button>
            </Link>
            <Link href="/store">
              <Button variant="ghost" size="sm" data-testid="link-nav-store">
                <Tablet className="w-4 h-4 mr-1" />
                Store Mode
              </Button>
            </Link>
            <Link href="/screening">
              <Button size="sm" data-testid="button-nav-start-test">
                Start Free Screen
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <Badge variant="secondary" className="mb-4" data-testid="badge-hero-label">
                Free · 3 Minutes · No Equipment Needed
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
                Understand Your{" "}
                <span className="gradient-text">Hearing Health</span>{" "}
                in Minutes
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 mb-8">
                Our quick, guided screening combines an audio test and clinically informed questionnaire to give you a clear picture of your hearing — and what to do next.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/screening">
                  <Button size="lg" className="text-base px-8 w-full sm:w-auto" data-testid="button-hero-start">
                    Take the Free Screen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/education">
                  <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto" data-testid="button-hero-learn">
                    Learn About Hearing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
                <div className="absolute inset-6 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
                <div className="absolute inset-12 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.6s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-primary flex items-center justify-center shadow-xl">
                    <Ear className="w-20 h-20 md:w-24 md:h-24 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-card rounded-md p-4 border border-card-border shadow-xs"
                data-testid={`feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Three simple steps
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              No specialist equipment, no clinic visit. Just you, your phone or tablet, and five minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <Card key={step.num} className="border-card-border" data-testid={`card-step-${i + 1}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{step.num}</span>
                      <h3 className="font-semibold text-foreground mt-0.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10">
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/screening">
              <Button size="lg" data-testid="button-steps-cta">
                Start My Free Screen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3">Real Stories</Badge>
            <h2 className="text-3xl font-bold text-foreground">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-card-border" data-testid={`card-testimonial-${t.name.toLowerCase().replace(/\s/g, "-")}`}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">Age {t.age}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                      {t.result}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education teaser */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <Badge variant="outline" className="mb-3">Education Hub</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Understand hearing at every level
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                From age-related changes to noise damage and tinnitus — our interactive infographics break down complex hearing science into clear, actionable insights. No jargon, just the facts you need.
              </p>
              <Link href="/education">
                <Button variant="outline" data-testid="button-education-cta">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore the Education Hub
                </Button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: "Age-Related Loss", icon: "🎯", color: "bg-teal-50 border-teal-200" },
                { label: "Noise & Tinnitus", icon: "🔊", color: "bg-amber-50 border-amber-200" },
                { label: "Brain Health Link", icon: "🧠", color: "bg-violet-50 border-violet-200" },
                { label: "Hearing Aid Facts", icon: "✓", color: "bg-emerald-50 border-emerald-200" },
              ].map((topic) => (
                <div
                  key={topic.label}
                  className={`${topic.color} border rounded-md p-4 hover-elevate cursor-pointer`}
                  data-testid={`card-edu-topic-${topic.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <span className="text-2xl block mb-2">{topic.icon}</span>
                  <p className="text-sm font-medium text-foreground">{topic.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't wait — your hearing matters
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg max-w-xl mx-auto">
            The average person waits 7 years after noticing hearing changes before seeking help. Take the first step today — it's free, fast, and could make a real difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/screening">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" data-testid="button-final-cta-screen">
                Start Free Screen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground" data-testid="button-final-cta-book">
              <CalendarDays className="w-4 h-4 mr-2" />
              Book an Appointment
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground" data-testid="button-final-cta-store">
              <MapPin className="w-4 h-4 mr-2" />
              Find a Store
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Ear className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">HearWell</span>
          </div>
          <p>This tool is a screening aid, not a medical diagnosis. Always consult a qualified audiologist.</p>
          <div className="flex gap-4">
            <Link href="/education"><span className="hover:text-foreground transition-colors cursor-pointer">Education</span></Link>
            <Link href="/store"><span className="hover:text-foreground transition-colors cursor-pointer">Store Mode</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

