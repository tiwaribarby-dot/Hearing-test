// Hearing questionnaire questions (HHIE-S style)
export const questionnaireQuestions = [
  {
    id: 1,
    text: "Does a hearing problem cause you to feel embarrassed when meeting new people?",
    category: "social",
  },
  {
    id: 2,
    text: "Does a hearing problem cause you to feel frustrated when talking to family members?",
    category: "emotional",
  },
  {
    id: 3,
    text: "Do you have difficulty hearing when someone speaks in a whisper?",
    category: "functional",
  },
  {
    id: 4,
    text: "Do you feel limited by a hearing problem in your daily activities?",
    category: "functional",
  },
  {
    id: 5,
    text: "Does a hearing problem cause you difficulty when visiting friends or family?",
    category: "social",
  },
  {
    id: 6,
    text: "Do you miss parts of conversations when in a noisy environment?",
    category: "functional",
  },
  {
    id: 7,
    text: "Does a hearing problem cause tension or arguments with people close to you?",
    category: "emotional",
  },
  {
    id: 8,
    text: "Do you need to turn up the TV or radio louder than others prefer?",
    category: "functional",
  },
  {
    id: 9,
    text: "Do you feel your hearing difficulty affects your personal or social life?",
    category: "social",
  },
  {
    id: 10,
    text: "Does following conversation in a restaurant or group setting feel difficult?",
    category: "functional",
  },
];

// Answer values
export const answerScores: Record<string, number> = {
  yes: 4,
  sometimes: 2,
  no: 0,
};

// Calculate questionnaire score
export function calculateQuestionnaireScore(answers: Record<number, string>): number {
  return Object.values(answers).reduce((total, answer) => {
    return total + (answerScores[answer] || 0);
  }, 0);
}

// Determine hearing category based on score
export function getHearingCategory(score: number): {
  category: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  recommendation: string;
} {
  if (score <= 8) {
    return {
      category: "normal",
      label: "Good Hearing",
      description: "Your responses suggest your hearing is functioning well and not significantly affecting your daily life.",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      recommendation: "Keep protecting your hearing with regular checkups and noise protection in loud environments.",
    };
  } else if (score <= 24) {
    return {
      category: "mild",
      label: "Mild to Moderate Difficulty",
      description: "Your responses suggest some hearing challenges that may occasionally impact your daily activities and social interactions.",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      recommendation: "We recommend a professional hearing assessment to understand your specific needs and explore solutions.",
    };
  } else {
    return {
      category: "significant",
      label: "Significant Difficulty",
      description: "Your responses suggest hearing challenges that are significantly affecting your quality of life and social connections.",
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      recommendation: "We strongly recommend scheduling a comprehensive hearing evaluation with one of our specialists as soon as possible.",
    };
  }
}

// Audio test frequencies
export const audioTestFrequencies = [
  { frequency: 500, label: "Low tones", description: "Bass sounds like background hum" },
  { frequency: 1000, label: "Mid tones", description: "Everyday speech sounds" },
  { frequency: 2000, label: "Mid-high tones", description: "Important for speech clarity" },
  { frequency: 4000, label: "High tones", description: "Often first affected by age" },
];

// Generate a pure tone using Web Audio API
export function playTone(
  frequency: number,
  duration: number = 2000,
  volume: number = 0.3
): () => void {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtx();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  // Fade in and out to avoid clicks
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + duration / 1000 - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration / 1000);

  return () => {
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    setTimeout(() => audioCtx.close(), 200);
  };
}

// Profile questions
export const profileQuestions = [
  {
    id: "age",
    label: "How old are you?",
    type: "number" as const,
    placeholder: "Enter your age",
    min: 18,
    max: 120,
  },
  {
    id: "gender",
    label: "What is your gender?",
    type: "select" as const,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
  },
  {
    id: "noiseExposure",
    label: "How often are you exposed to loud noise (machinery, music, etc.)?",
    type: "select" as const,
    options: [
      { value: "never", label: "Never" },
      { value: "occasionally", label: "Occasionally" },
      { value: "regularly", label: "Regularly (a few times a week)" },
      { value: "daily", label: "Daily" },
    ],
  },
  {
    id: "tinnitus",
    label: "Do you experience ringing or buzzing in your ears (tinnitus)?",
    type: "select" as const,
    options: [
      { value: "never", label: "Never" },
      { value: "occasionally", label: "Occasionally" },
      { value: "often", label: "Often" },
      { value: "always", label: "Always" },
    ],
  },
  {
    id: "hearingAids",
    label: "Do you currently use hearing aids?",
    type: "select" as const,
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "lastHearingTest",
    label: "When did you last have a professional hearing test?",
    type: "select" as const,
    options: [
      { value: "never", label: "Never" },
      { value: "over_5_years", label: "More than 5 years ago" },
      { value: "1_5_years", label: "1–5 years ago" },
      { value: "within_year", label: "Within the last year" },
    ],
  },
];
