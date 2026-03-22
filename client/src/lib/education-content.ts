export interface EducationTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  accentColor: string;
  stat: string;
  statLabel: string;
  summary: string;
  facts: { heading: string; detail: string }[];
  tips: string[];
  productHint?: string;
}

export const educationTopics: EducationTopic[] = [
  {
    id: "age-related-loss",
    title: "Age-Related Hearing Loss",
    subtitle: "Presbycusis",
    icon: "Clock",
    color: "from-teal-500 to-teal-700",
    accentColor: "bg-teal-50 border-teal-200 text-teal-800",
    stat: "1 in 3",
    statLabel: "adults over 65 has significant hearing loss",
    summary:
      "Presbycusis is the gradual loss of hearing that occurs as we age. It's the most common cause of hearing loss in adults and affects both ears equally.",
    facts: [
      {
        heading: "It starts earlier than you think",
        detail:
          "Hearing changes often begin in our 40s and 50s, long before most people seek help. High-frequency sounds — like birdsong or speech consonants — are usually affected first.",
      },
      {
        heading: "Speech comprehension suffers most",
        detail:
          "Even with moderate age-related loss, speech can sound muffled or unclear in noisy environments because high-frequency consonants (s, f, th) are hardest to hear.",
      },
      {
        heading: "It's gradual and often unnoticed",
        detail:
          "Because the change is slow, many people adapt without realising. Friends and family often notice changes before the person themselves does.",
      },
      {
        heading: "Treatment is effective",
        detail:
          "Modern hearing aids are remarkably sophisticated. They can restore speech clarity, reduce listening effort, and significantly improve quality of life.",
      },
    ],
    tips: [
      "Have a hearing test every two years after age 50",
      "Face people when they speak to you in difficult environments",
      "Reduce background noise when having conversations",
      "Let people know you have difficulty so they can help",
    ],
    productHint:
      "Our receiver-in-canal and behind-the-ear styles are designed specifically to address the high-frequency loss pattern of presbycusis.",
  },
  {
    id: "noise-induced",
    title: "Noise-Induced Hearing Loss",
    subtitle: "NIHL",
    icon: "Volume2",
    color: "from-amber-500 to-orange-600",
    accentColor: "bg-amber-50 border-amber-200 text-amber-800",
    stat: "1.1B",
    statLabel: "young people at risk from unsafe listening habits",
    summary:
      "Exposure to loud sounds damages the tiny hair cells in your inner ear. Unlike other cells, these don't regenerate — making noise-induced hearing loss permanent.",
    facts: [
      {
        heading: "85 dB is the threshold",
        detail:
          "Sounds at or above 85 decibels can cause permanent damage with prolonged exposure. A lawnmower is about 90 dB; live music can reach 110–120 dB.",
      },
      {
        heading: "Damage is cumulative",
        detail:
          "Each exposure adds up over a lifetime. A single very loud event (explosion, gunshot) can cause immediate permanent damage.",
      },
      {
        heading: "Tinnitus is an early warning sign",
        detail:
          "Ringing or buzzing in the ears after noise exposure signals that damage has occurred. Recurring tinnitus is a strong predictor of developing hearing loss.",
      },
      {
        heading: "Prevention is the only cure",
        detail:
          "There is currently no medical treatment to reverse NIHL. Proper ear protection is the only effective strategy.",
      },
    ],
    tips: [
      "Use ear protection (earplugs or earmuffs) in loud environments",
      "Keep personal audio devices below 60% volume",
      "Take 'sound breaks' — give your ears rest after loud exposure",
      "Choose noise-cancelling headphones to avoid turning up volume",
    ],
    productHint:
      "Our custom-fit ear protection range offers professional-grade noise reduction without sacrificing sound quality for musicians and professionals.",
  },
  {
    id: "tinnitus",
    title: "Tinnitus",
    subtitle: "Ringing in the Ears",
    icon: "Waves",
    color: "from-violet-500 to-purple-700",
    accentColor: "bg-violet-50 border-violet-200 text-violet-800",
    stat: "15%",
    statLabel: "of adults experience chronic tinnitus",
    summary:
      "Tinnitus is the perception of sound — ringing, buzzing, hissing — without an external source. It's a symptom, not a disease, and can range from mildly irritating to seriously disruptive.",
    facts: [
      {
        heading: "There are two main types",
        detail:
          "Subjective tinnitus (only you can hear it) accounts for 99% of cases. Objective tinnitus (a clinician can also hear it) is rare and often has a treatable vascular cause.",
      },
      {
        heading: "It's closely linked to hearing loss",
        detail:
          "About 90% of people with tinnitus also have some degree of hearing loss. Hearing aids often provide relief by amplifying background sounds.",
      },
      {
        heading: "Stress makes it worse",
        detail:
          "Tinnitus loudness perception increases with stress, fatigue, and anxiety, creating a difficult cycle. Relaxation techniques can help break this.",
      },
      {
        heading: "Management approaches are effective",
        detail:
          "Tinnitus Retraining Therapy (TRT), sound therapy, and cognitive behavioural therapy (CBT) have strong evidence for reducing tinnitus impact.",
      },
    ],
    tips: [
      "Avoid complete silence — use low-level background sound (fan, white noise)",
      "Protect your ears from further noise damage",
      "Manage stress through regular exercise and relaxation",
      "Discuss sound therapy options with a hearing specialist",
    ],
    productHint:
      "Several of our hearing aid models include built-in tinnitus sound therapy programmes, combining amplification with relief.",
  },
  {
    id: "speech-understanding",
    title: "Speech Understanding",
    subtitle: "Why hearing is more than volume",
    icon: "MessageSquare",
    color: "from-sky-500 to-blue-700",
    accentColor: "bg-sky-50 border-sky-200 text-sky-800",
    stat: "50%",
    statLabel: "of speech understanding relies on consonants above 2,000 Hz",
    summary:
      "You can hear voices but struggle to understand words — especially in noise. This is one of the most common hearing complaints and reflects how the brain processes sound, not just loudness.",
    facts: [
      {
        heading: "The cocktail party problem",
        detail:
          "Separating speech from background noise requires the brain to 'attend' to one voice among many. Hearing loss makes this dramatically harder and more exhausting.",
      },
      {
        heading: "Consonants carry meaning",
        detail:
          "Vowels are loud and easy to hear; consonants are quiet and high-frequency. Losing consonant clarity turns 'cat' into '_at' — the brain must guess constantly.",
      },
      {
        heading: "Listening fatigue is real",
        detail:
          "People with untreated hearing loss often feel mentally exhausted after conversations because of the extra cognitive effort required. This can reduce social engagement.",
      },
      {
        heading: "Auditory training can help",
        detail:
          "Alongside hearing aids, auditory rehabilitation programmes retrain the brain to process sound more efficiently — improving clarity over time.",
      },
    ],
    tips: [
      "Choose quieter seating positions in restaurants (corner tables, away from speakers)",
      "Ask people to rephrase rather than just repeat louder",
      "Use subtitles when watching TV",
      "Consider an FM or loop system for meetings and lectures",
    ],
    productHint:
      "Our directional microphone technology and AI-powered noise reduction help the brain focus on speech, dramatically improving clarity in noisy places.",
  },
  {
    id: "brain-hearing",
    title: "Hearing & Brain Health",
    subtitle: "The cognitive connection",
    icon: "Brain",
    color: "from-emerald-500 to-green-700",
    accentColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    stat: "5×",
    statLabel: "higher dementia risk with untreated significant hearing loss",
    summary:
      "Research increasingly links untreated hearing loss to accelerated cognitive decline, social isolation, and depression. Treating hearing loss may help protect brain health.",
    facts: [
      {
        heading: "Auditory deprivation strains the brain",
        detail:
          "When the ears don't send enough signal, the brain must work harder to interpret sound, leaving fewer resources for memory and thinking.",
      },
      {
        heading: "Social isolation is a key pathway",
        detail:
          "Difficulty hearing leads many people to withdraw from social situations. Social isolation is one of the strongest known risk factors for dementia.",
      },
      {
        heading: "Early treatment matters",
        detail:
          "Studies suggest that treating hearing loss in midlife may reduce the risk of cognitive decline. The earlier treatment begins, the better the outcomes.",
      },
      {
        heading: "Hearing aids show promise",
        detail:
          "A 2023 landmark trial (ACHIEVE study) found that hearing aid use significantly reduced cognitive decline in adults at high risk of dementia.",
      },
    ],
    tips: [
      "Treat hearing loss early — don't wait until it becomes severe",
      "Stay socially active and engaged with friends and community",
      "Keep your mind active with learning, hobbies, and puzzles",
      "Manage cardiovascular risk factors — what's good for the heart is good for hearing",
    ],
    productHint:
      "Investing in better hearing is investing in your brain. Our comprehensive care approach includes long-term monitoring and support.",
  },
  {
    id: "hearing-aid-myths",
    title: "Hearing Aid Myths",
    subtitle: "Separating fact from fiction",
    icon: "ShieldCheck",
    color: "from-rose-500 to-red-700",
    accentColor: "bg-rose-50 border-rose-200 text-rose-800",
    stat: "7 years",
    statLabel: "average time people wait before getting help",
    summary:
      "Misconceptions about hearing aids prevent many people from seeking help that could transform their lives. Let's clear up the most common myths.",
    facts: [
      {
        heading: "Myth: Only old people wear hearing aids",
        detail:
          "Hearing loss affects all ages. Modern devices are sleek, discreet, and often invisible. Many models sit completely inside the ear canal.",
      },
      {
        heading: "Myth: Hearing aids restore normal hearing",
        detail:
          "They amplify and clarify sound significantly, but can't fully replicate natural hearing. With the right device and proper fitting, many people achieve excellent outcomes.",
      },
      {
        heading: "Myth: One ear affected means I only need one aid",
        detail:
          "Binaural hearing (both ears) is critical for sound localisation and noise separation. Two aids typically provide far better results than one.",
      },
      {
        heading: "Myth: Hearing aids are too expensive",
        detail:
          "A wide range of price points exists, from NHS provision to premium private options. Our advisers help match technology to your lifestyle and budget.",
      },
    ],
    tips: [
      "Try before you buy — ask for a trial period",
      "Allow 4–6 weeks for your brain to adapt to amplification",
      "Follow-up appointments are as important as the initial fitting",
      "Insurance or NHS support may cover part of the cost",
    ],
    productHint:
      "Our range spans from expertly fitted NHS-equivalent devices to premium AI-powered hearing systems — there's an option for every lifestyle and budget.",
  },
];
