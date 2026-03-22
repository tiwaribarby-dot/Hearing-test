import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import {
  Ear, Volume2, ChevronRight, ChevronLeft, CheckCircle,
  Play, RotateCcw, ArrowRight, Mail, User, Shield
} from "lucide-react";
import {
  profileQuestions,
  questionnaireQuestions,
  audioTestFrequencies,
  playTone,
  calculateQuestionnaireScore,
  getHearingCategory,
  answerScores,
} from "../lib/screening";

type Step = "profile" | "audio" | "questionnaire" | "email";

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "audio", label: "Audio Test", icon: <Volume2 className="w-4 h-4" /> },
  { id: "questionnaire", label: "Questions", icon: <Ear className="w-4 h-4" /> },
  { id: "email", label: "Results", icon: <Mail className="w-4 h-4" /> },
];

export default function Screening() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("profile");
  const [profile, setProfile] = useState<Record<string, string | number>>({});
  const [audioResults, setAudioResults] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
  const [currentAudioIdx, setCurrentAudioIdx] = useState(0);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progressPct = ((stepIndex) / (STEPS.length)) * 100;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const score = calculateQuestionnaireScore(questionAnswers);
      const category = getHearingCategory(score).category;
      const questionnaireAnswers = Object.entries(questionAnswers).map(([qId, answer]) => ({
        questionId: Number(qId),
        answer,
        score: answerScores[answer] || 0,
      }));
      const audioResultsArr = Object.entries(audioResults).map(([freqIdx, difficulty]) => ({
        frequency: audioTestFrequencies[Number(freqIdx)].frequency,
        label: audioTestFrequencies[Number(freqIdx)].label,
        heard: difficulty !== "couldnt_hear",
        difficulty,
      }));

      const payload = {
        name,
        email,
        age: Number(profile.age || 50),
        gender: String(profile.gender || ""),
        noiseExposure: String(profile.noiseExposure || ""),
        tinnitus: String(profile.tinnitus || ""),
        profileAnswers: profile,
        audioResults: audioResultsArr,
        questionnaireAnswers,
        questionnaireScore: score,
        category,
      };

      const result = await apiRequest("POST", "/api/test-results", payload);
      return result.json();
    },
    onSuccess: (data) => {
      navigate(`/results/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "We couldn't save your results. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileChange = (id: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const profileComplete = profileQuestions.every(
    (q) => profile[q.id] !== undefined && profile[q.id] !== ""
  );

  const handlePlayTone = useCallback(() => {
    const freq = audioTestFrequencies[currentAudioIdx];
    setIsPlayingTone(true);
    setAudioPlayed(false);
    const stop = playTone(freq.frequency, 2500, 0.3);
    setTimeout(() => {
      setIsPlayingTone(false);
      setAudioPlayed(true);
      stop();
    }, 2600);
  }, [currentAudioIdx]);

  const handleAudioAnswer = (answer: string) => {
    setAudioResults((prev) => ({ ...prev, [currentAudioIdx]: answer }));
    if (currentAudioIdx < audioTestFrequencies.length - 1) {
      setCurrentAudioIdx((i) => i + 1);
      setAudioPlayed(false);
      setIsPlayingTone(false);
    } else {
      setCurrentStep("questionnaire");
      setCurrentAudioIdx(0);
    }
  };

  const handleQuestionAnswer = (answer: string) => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [questionnaireQuestions[currentQuestionIdx].id]: answer,
    }));
    if (currentQuestionIdx < questionnaireQuestions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
    } else {
      setCurrentStep("email");
    }
  };

  const canSubmit = name.trim() && email.trim() && email.includes("@") && consentGiven;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-screening-logo">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Ear className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">HearWell</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                      i < stepIndex
                        ? "bg-primary text-primary-foreground"
                        : i === stepIndex
                        ? "bg-primary/15 text-primary font-medium"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${s.id}`}
                  >
                    {i < stepIndex ? <CheckCircle className="w-3 h-3" /> : s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Progress value={progressPct} className="h-1.5" data-testid="progress-bar" />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* STEP 1: Profile */}
        {currentStep === "profile" && (
          <div className="space-y-6" data-testid="step-profile">
            <div>
              <Badge variant="secondary" className="mb-2">Step 1 of 4</Badge>
              <h1 className="text-2xl font-bold text-foreground">Tell us about yourself</h1>
              <p className="text-muted-foreground mt-1">
                These questions help us personalise your results. All information stays private.
              </p>
            </div>

            <div className="space-y-5">
              {profileQuestions.map((q) => (
                <div key={q.id} className="space-y-2" data-testid={`field-${q.id}`}>
                  <Label htmlFor={q.id} className="text-sm font-medium text-foreground">
                    {q.label}
                  </Label>
                  {q.type === "number" ? (
                    <Input
                      id={q.id}
                      type="number"
                      min={q.min}
                      max={q.max}
                      placeholder={q.placeholder}
                      value={profile[q.id] || ""}
                      onChange={(e) => handleProfileChange(q.id, e.target.value)}
                      className="text-base"
                      data-testid={`input-${q.id}`}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleProfileChange(q.id, opt.value)}
                          className={`p-3 rounded-md border text-sm text-left transition-all hover-elevate ${
                            profile[q.id] === opt.value
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border bg-card text-foreground"
                          }`}
                          data-testid={`option-${q.id}-${opt.value}`}
                        >
                          {profile[q.id] === opt.value && (
                            <CheckCircle className="w-3 h-3 inline mr-1 text-primary" />
                          )}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!profileComplete}
              onClick={() => setCurrentStep("audio")}
              data-testid="button-profile-next"
            >
              Continue to Audio Test
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2: Audio Test */}
        {currentStep === "audio" && (
          <div className="space-y-6" data-testid="step-audio">
            <div>
              <Badge variant="secondary" className="mb-2">Step 2 of 4</Badge>
              <h1 className="text-2xl font-bold text-foreground">Audio Tone Test</h1>
              <p className="text-muted-foreground mt-1">
                Put on headphones or hold your device close. We'll play a sound — just tell us how clearly you heard it.
              </p>
            </div>

            {/* Frequency progress */}
            <div className="flex gap-2">
              {audioTestFrequencies.map((f, i) => (
                <div
                  key={f.frequency}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    i < currentAudioIdx
                      ? "bg-primary"
                      : i === currentAudioIdx
                      ? "bg-primary/40"
                      : "bg-muted"
                  }`}
                  data-testid={`freq-indicator-${i}`}
                />
              ))}
            </div>

            <Card className="border-card-border" data-testid="card-audio-test">
              <CardContent className="p-8 text-center">
                <div className="mb-2">
                  <Badge variant="outline">{currentAudioIdx + 1} of {audioTestFrequencies.length}</Badge>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {audioTestFrequencies[currentAudioIdx].label}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {audioTestFrequencies[currentAudioIdx].description}
                </p>

                {/* Play button with visualiser */}
                <div className="flex flex-col items-center gap-6 mb-8">
                  <div className="relative">
                    {isPlayingTone && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 pulse-ring scale-125" />
                        <div className="absolute inset-0 rounded-full bg-primary/10 pulse-ring scale-150" style={{ animationDelay: "0.5s" }} />
                      </>
                    )}
                    <button
                      onClick={handlePlayTone}
                      disabled={isPlayingTone}
                      className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                        isPlayingTone
                          ? "bg-primary text-primary-foreground scale-105"
                          : "bg-primary/10 text-primary border-2 border-primary/30 hover:bg-primary/20"
                      }`}
                      data-testid="button-play-tone"
                    >
                      {isPlayingTone ? (
                        <div className="flex items-end gap-1 h-8">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="wave-bar w-1.5 bg-primary-foreground rounded-full"
                              style={{ height: "60%", animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Play className="w-10 h-10" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isPlayingTone
                      ? "Playing tone... listen carefully"
                      : audioPlayed
                      ? "How clearly did you hear it?"
                      : "Tap to play the tone"}
                  </p>
                </div>

                {/* Answer buttons */}
                {audioPlayed && !isPlayingTone && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "clear", label: "Heard clearly", color: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
                      { value: "faint", label: "Faint / unsure", color: "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100" },
                      { value: "couldnt_hear", label: "Couldn't hear", color: "border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAudioAnswer(opt.value)}
                        className={`p-3 rounded-md border text-sm font-medium transition-all hover-elevate ${opt.color}`}
                        data-testid={`button-audio-answer-${opt.value}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Replay */}
                {audioPlayed && !isPlayingTone && (
                  <button
                    onClick={handlePlayTone}
                    className="mt-4 text-xs text-muted-foreground flex items-center gap-1 mx-auto"
                    data-testid="button-replay-tone"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Replay tone
                  </button>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("profile")}
                data-testid="button-audio-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <p className="flex-1 text-xs text-muted-foreground self-center text-center">
                Use headphones for best results. Ensure your volume is at a comfortable level.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Questionnaire */}
        {currentStep === "questionnaire" && (
          <div className="space-y-6" data-testid="step-questionnaire">
            <div>
              <Badge variant="secondary" className="mb-2">Step 3 of 4</Badge>
              <h1 className="text-2xl font-bold text-foreground">Self-Assessment</h1>
              <p className="text-muted-foreground mt-1">
                These questions help us understand how hearing affects your daily life. Answer honestly for the most accurate results.
              </p>
            </div>

            {/* Question progress */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Question {currentQuestionIdx + 1}
              </span>
              <span>of {questionnaireQuestions.length}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full ml-2">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentQuestionIdx) / questionnaireQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <Card className="border-card-border min-h-[220px]" data-testid="card-questionnaire">
              <CardContent className="p-8">
                <Badge
                  variant="outline"
                  className="mb-4 capitalize"
                >
                  {questionnaireQuestions[currentQuestionIdx].category}
                </Badge>
                <h2 className="text-xl font-semibold text-foreground mb-8 leading-snug">
                  {questionnaireQuestions[currentQuestionIdx].text}
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "yes", label: "Yes", points: 4, color: "border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100" },
                    { value: "sometimes", label: "Sometimes", points: 2, color: "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100" },
                    { value: "no", label: "No", points: 0, color: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleQuestionAnswer(opt.value)}
                      className={`p-4 rounded-md border text-sm font-semibold transition-all hover-elevate ${opt.color}`}
                      data-testid={`button-question-answer-${opt.value}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Back navigation */}
            {currentQuestionIdx > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentQuestionIdx((i) => i - 1)}
                data-testid="button-question-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous question
              </Button>
            )}
          </div>
        )}

        {/* STEP 4: Email Capture */}
        {currentStep === "email" && (
          <div className="space-y-6" data-testid="step-email">
            <div>
              <Badge variant="secondary" className="mb-2">Step 4 of 4</Badge>
              <h1 className="text-2xl font-bold text-foreground">Get your results</h1>
              <p className="text-muted-foreground mt-1">
                Your results are ready. Enter your email to receive a full copy and personalised recommendations.
              </p>
            </div>

            <Card className="border-card-border">
              <CardHeader>
                <CardTitle className="text-base">Your results summary</CardTitle>
                <CardDescription>
                  Score based on {questionnaireQuestions.length} questions answered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Audio test completed — {audioTestFrequencies.length} frequency ranges tested
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Self-assessment completed — {questionnaireQuestions.length} lifestyle questions answered
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer" data-testid="label-consent">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  data-testid="checkbox-consent"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to receive my results by email and understand this is a screening tool, not a medical diagnosis. I'm happy to be contacted about follow-up services.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 flex-shrink-0" />
              <span>Your data is handled securely and never sold to third parties.</span>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!canSubmit || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
              data-testid="button-submit-results"
            >
              {submitMutation.isPending ? (
                "Submitting..."
              ) : (
                <>
                  See My Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
