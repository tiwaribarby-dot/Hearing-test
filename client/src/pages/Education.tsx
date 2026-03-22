import { useState } from "react";
import { Link } from "wouter";

// ✅ UI COMPONENTS (client folder se)
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// ✅ ICONS
import {
  Ear, Clock, Volume2, Waves, MessageSquare, Brain, ShieldCheck,
  ChevronDown, ChevronUp, ArrowRight, BookOpen, Lightbulb, Info
} from "lucide-react";

// ✅ FIXED LIB PATH (IMPORTANT)
import { educationTopics } from "../lib/education-content";
const gradientMap: Record<string, string> = {
  "from-teal-500 to-teal-700": "bg-gradient-to-br from-teal-500 to-teal-700",
  "from-amber-500 to-orange-600": "bg-gradient-to-br from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700": "bg-gradient-to-br from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700": "bg-gradient-to-br from-sky-500 to-blue-700",
  "from-emerald-500 to-green-700": "bg-gradient-to-br from-emerald-500 to-green-700",
  "from-rose-500 to-red-700": "bg-gradient-to-br from-rose-500 to-red-700",
};

function TopicCard({ topic }: { topic: typeof educationTopics[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"facts" | "tips">("facts");

  return (
    <Card
      className="border-card-border overflow-visible"
      data-testid={`card-topic-${topic.id}`}
    >
      {/* Card header with gradient */}
      <div
        className={`${gradientMap[topic.color]} rounded-t-lg p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/10 translate-y-6 -translate-x-4" />
        <div className="relative">
          <div className="w-12 h-12 rounded-md bg-white/20 flex items-center justify-center mb-3">
            {iconMap[topic.icon]}
          </div>
          <div className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
            {topic.subtitle}
          </div>
          <h3 className="text-xl font-bold text-white">{topic.title}</h3>
        </div>
      </div>

      {/* Stat strip */}
      <div className={`${topic.accentColor} border-b px-6 py-3 flex items-center gap-3`}>
        <span className="text-2xl font-extrabold">{topic.stat}</span>
        <span className="text-sm font-medium">{topic.statLabel}</span>
      </div>

      {/* Summary */}
      <CardContent className="p-5">
        <p className="text-sm text-foreground leading-relaxed mb-4">{topic.summary}</p>

        {/* Expand / collapse */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          data-testid={`button-expand-${topic.id}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Read more — facts & tips
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4" data-testid={`expanded-${topic.id}`}>
            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setActiveTab("facts")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "facts"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
                data-testid={`tab-facts-${topic.id}`}
              >
                <Info className="w-3 h-3 inline mr-1" />
                Key Facts
              </button>
              <button
                onClick={() => setActiveTab("tips")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "tips"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
                data-testid={`tab-tips-${topic.id}`}
              >
                <Lightbulb className="w-3 h-3 inline mr-1" />
                Helpful Tips
              </button>
            </div>

            {activeTab === "facts" && (
              <div className="space-y-3">
                {topic.facts.map((fact, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-muted/50"
                    data-testid={`fact-${topic.id}-${i}`}
                  >
                    <p className="text-sm font-semibold text-foreground mb-1">{fact.heading}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{fact.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tips" && (
              <div className="space-y-2">
                {topic.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2"
                    data-testid={`tip-${topic.id}-${i}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Product hint */}
            {topic.productHint && (
              <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
                <p className="text-xs text-primary leading-relaxed">
                  <strong>Our solutions:</strong> {topic.productHint}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Education() {
  const [filter, setFilter] = useState<string>("all");

  const filterCategories = [
    { id: "all", label: "All Topics" },
    { id: "loss", label: "Hearing Loss" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "treatment", label: "Treatment" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-edu-logo">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Ear className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">HearWell</span>
            </div>
          </Link>
          <Link href="/screening">
            <Button size="sm" data-testid="button-edu-nav-test">
              Take Free Screen
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="outline" className="mb-3">
            <BookOpen className="w-3 h-3 mr-1" />
            Education Hub
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Understanding Hearing Health
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Bite-sized, evidence-based guides to help you understand hearing loss, protect your hearing, and explore what's possible with modern solutions.
          </p>
        </div>
      </div>

      {/* Topics grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-lg bg-primary text-primary-foreground p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to check your hearing?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto text-sm">
            Take our free 3-minute screening to understand where your hearing stands today.
          </p>
          <Link href="/screening">
            <Button
              variant="secondary"
              size="lg"
              data-testid="button-edu-bottom-cta"
            >
              Start Free Screen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
