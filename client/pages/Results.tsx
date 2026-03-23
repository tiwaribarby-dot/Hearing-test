import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import {
  Ear, CalendarDays, MapPin, BookOpen, CheckCircle,
  ArrowRight, Volume2, RotateCcw, AlertTriangle, ThumbsUp
} from "lucide-react";
import type { TestResult } from "../../../shared/schema";
import { getHearingCategory, questionnaireQuestions, audioTestFrequencies } from "../lib/screening";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const GAUGE_COLORS = {
  normal: ["#059669", "#d1fae5"],
  mild: ["#d97706", "#fef3c7"],
  significant: ["#e11d48", "#ffe4e6"],
};

function ScoreGauge({ score }: { score: number }) {
  const max = 40;
  const pct = Math.min((score / max) * 100, 100);
  const category = getHearingCategory(score);

  const gaugeData = [
    { value: pct, fill: score <= 8 ? "#059669" : score <= 24 ? "#d97706" : "#e11d48" },
    { value: 100 - pct, fill: "#f1f5f9" },
  ];

  return (
    <div className="flex flex-col items-center" data-testid="score-gauge">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={88}
              dataKey="value"
              strokeWidth={0}
            >
              {gaugeData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: "20%" }}>
          <span className="text-4xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">out of 40</span>
        </div>
      </div>
    </div>
  );
}

function AudioSummary({ audioResults }: { audioResults: any[] }) {
  if (!audioResults || audioResults.length === 0) return null;

  return (
    <div className="space-y-3">
      {audioTestFrequencies.map((freq, i) => {
        const result = audioResults.find((r: any) => r.frequency === freq.frequency);
        const difficulty = result?.difficulty || "couldnt_hear";
        const colorMap: Record<string, string> = {
          clear: "text-emerald-700 bg-emerald-50",
          faint: "text-amber-700 bg-amber-50",
          couldnt_hear: "text-rose-700 bg-rose-50",
        };
        const labelMap: Record<string, string> = {
          clear: "Heard clearly",
          faint: "Faint",
          couldnt_hear: "Not heard",
        };

        return (
          <div
            key={freq.frequency}
            className="flex items-center justify-between p-3 rounded-md bg-muted/50"
            data-testid={`audio-result-${freq.frequency}`}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{freq.label}</p>
              <p className="text-xs text-muted-foreground">{freq.frequency} Hz — {freq.description}</p>
            </div>
            <Badge
              variant="secondary"
              className={`text-xs ${colorMap[difficulty]}`}
            >
              {labelMap[difficulty]}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

export default function Results() {
  const { id } = useParams<{ id: string }>();

  const { data: result, isLoading } = useQuery<TestResult>({
    queryKey: ["/api/test-results", id],
    queryFn: async () => {
      const res = await fetch(`/api/test-results/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Result not found.</p>
          <Link href="/screening">
            <Button className="mt-4">Take the Screen</Button>
          </Link>
        </div>
      </div>
    );
  }

  const score = result.questionnaireScore;
  const categoryInfo = getHearingCategory(score);
  const audioResults = (result.audioResults as any[]) || [];
  const answers = (result.questionnaireAnswers as any[]) || [];

  const categoryColorMap: Record<string, { banner: string; badge: string }> = {
    normal: {
      banner: "bg-emerald-50 border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    mild: {
      banner: "bg-amber-50 border-amber-200",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
    },
    significant: {
      banner: "bg-rose-50 border-rose-200",
      badge: "bg-rose-100 text-rose-800 border-rose-200",
    },
  };
  const colors = categoryColorMap[categoryInfo.category] || categoryColorMap.normal;

  const radarData = [
    { subject: "Social", value: 0 },
    { subject: "Emotional", value: 0 },
    { subject: "Functional", value: 0 },
  ];
  answers.forEach((a: any) => {
    const q = questionnaireQuestions.find((q) => q.id === a.questionId);
    if (q) {
      const idx = radarData.findIndex((r) => r.subject.toLowerCase() === q.category);
      if (idx >= 0) radarData[idx].value += a.score || 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-results-logo">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Ear className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">HearWell</span>
            </div>
          </Link>
          <Link href="/screening">
            <Button variant="outline" size="sm" data-testid="button-retake">
              <RotateCcw className="w-3 h-3 mr-1" />
              Retake Test
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Result banner */}
        <div className={`rounded-lg border p-6 ${colors.banner}`} data-testid="result-banner">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreGauge score={score} />
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-1">Hello, {result.name}</p>
              <h1 className="text-2xl font-bold text-foreground mb-2">{categoryInfo.label}</h1>
              <Badge className={`${colors.badge} mb-3 border`}>
                {categoryInfo.category === "normal"
                  ? "No significant concern"
                  : categoryInfo.category === "mild"
                  ? "Some difficulty identified"
                  : "Action recommended"}
              </Badge>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {categoryInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Plain language summary */}
        <Card className="border-card-border" data-testid="card-summary">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {categoryInfo.category === "normal" ? (
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              What this means for you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground leading-relaxed">
              {categoryInfo.recommendation}
            </p>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Your questionnaire score: <strong>{score} / 40</strong> — {
                  score <= 8
                    ? "within the normal range"
                    : score <= 24
                    ? "suggests mild to moderate difficulty"
                    : "suggests significant hearing difficulty"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Test Results */}
        <Card className="border-card-border" data-testid="card-audio-results">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Audio Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AudioSummary audioResults={audioResults} />
          </CardContent>
        </Card>

        {/* Impact radar */}
        {answers.length > 0 && (
          <Card className="border-card-border" data-testid="card-impact-radar">
            <CardHeader>
              <CardTitle className="text-base">Impact Profile</CardTitle>
              <p className="text-xs text-muted-foreground">How hearing affects different areas of your life</p>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Radar
                      name="Impact"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score breakdown */}
        <Card className="border-card-border" data-testid="card-score-breakdown">
          <CardHeader>
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Normal range", range: "0 – 8", max: 8, color: "bg-emerald-500" },
              { label: "Mild to moderate", range: "10 – 24", max: 24, color: "bg-amber-500" },
              { label: "Significant difficulty", range: "26 – 40", max: 40, color: "bg-rose-500" },
            ].map(({ label, range, max, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{range}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} ${score <= max && score > (max === 8 ? -1 : max === 24 ? 8 : 24) ? "opacity-100" : "opacity-30"}`}
                    style={{ width: `${(max / 40) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-foreground">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Your score: {score}</span>
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="space-y-3" data-testid="section-cta">
          <h2 className="font-semibold text-foreground">Your next steps</h2>
          <Card className="border-card-border">
            <CardContent className="p-4 space-y-3">
              <Button className="w-full justify-start" data-testid="button-book-appointment">
                <CalendarDays className="w-4 h-4 mr-3" />
                Book a Free Hearing Consultation
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-find-store">
                <MapPin className="w-4 h-4 mr-3" />
                Find Your Nearest Store
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Link href="/education" className="block">
                <Button variant="outline" className="w-full justify-start" data-testid="button-learn-more">
                  <BookOpen className="w-4 h-4 mr-3" />
                  Learn More About Hearing Health
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-4" data-testid="text-disclaimer">
          This screening tool is for indicative purposes only and is not a substitute for a professional audiological assessment. Results have been sent to {result.email}.
        </p>
      </div>
    </div>
  );
}
