export type ReadinessLevel = "emerging" | "developing" | "competitive" | "standout";

export type ScoreCategory = {
  key: string;
  label: string;
  score: number; // 0 - 100
  summary: string;
  icon: string;
};

export type Recommendation = {
  id: string;
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
  category: string;
  estimate: string;
};

export type IntegrationInputType = "link" | "upload";

export type Integration = {
  key: string;
  name: string;
  description: string;
  icon: string;
  inputType: IntegrationInputType;
  linkPlaceholder?: string;
  acceptedTypes?: string;
  uploadHint?: string;
};

export type TargetRole = {
  id: string;
  title: string;
  match: number;
};

export const readinessLevels: Record<
  ReadinessLevel,
  { label: string; color: string; range: [number, number] }
> = {
  emerging: { label: "Emerging", color: "text-danger", range: [0, 40] },
  developing: { label: "Developing", color: "text-warning", range: [40, 65] },
  competitive: { label: "Competitive", color: "text-info", range: [65, 85] },
  standout: { label: "Standout", color: "text-accent-400", range: [85, 100] },
};

export function levelForScore(score: number): ReadinessLevel {
  if (score >= 85) return "standout";
  if (score >= 65) return "competitive";
  if (score >= 40) return "developing";
  return "emerging";
}

export const overallScore = 72;

export const scoreCategories: ScoreCategory[] = [
  {
    key: "dsa",
    label: "Data Structures & Algorithms",
    score: 68,
    summary: "Solid on arrays & trees. Graphs and DP need reps.",
    icon: "🧠",
  },
  {
    key: "projects",
    label: "Projects & Portfolio",
    score: 81,
    summary: "Two strong full-stack projects with live demos.",
    icon: "🚀",
  },
  {
    key: "github",
    label: "Open Source & GitHub",
    score: 64,
    summary: "Consistent commits, but READMEs could go deeper.",
    icon: "🐙",
  },
  {
    key: "systemdesign",
    label: "System Design",
    score: 52,
    summary: "Good fundamentals; practice scaling & trade-offs.",
    icon: "🏗️",
  },
  {
    key: "resume",
    label: "Resume & Experience",
    score: 77,
    summary: "Quantified impact well. Trim to a single page.",
    icon: "📄",
  },
  {
    key: "behavioral",
    label: "Behavioral & Comms",
    score: 74,
    summary: "Clear STAR stories. Add more leadership examples.",
    icon: "💬",
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "r1",
    title: "Grind 15 graph problems this week",
    detail:
      "Your LeetCode history shows a gap in BFS/DFS and union-find. These show up in ~30% of interviews for your target roles.",
    impact: "high",
    category: "DSA",
    estimate: "~4 hrs",
  },
  {
    id: "r2",
    title: "Add architecture diagrams to Nimbus project",
    detail:
      "Recruiters skim repos in seconds. A clear diagram + demo GIF in your top pinned repo boosts credibility fast.",
    impact: "high",
    category: "Projects",
    estimate: "~2 hrs",
  },
  {
    id: "r3",
    title: "Practice one system design mock",
    detail:
      "Design a URL shortener end-to-end. Focus on estimating load and justifying your database choice.",
    impact: "medium",
    category: "System Design",
    estimate: "~1 hr",
  },
  {
    id: "r4",
    title: "Tighten resume to a single page",
    detail:
      "Two bullet points reference the same internship. Consolidate and lead with metrics.",
    impact: "low",
    category: "Resume",
    estimate: "~30 min",
  },
];

export const integrations: Integration[] = [
  {
    key: "github",
    name: "GitHub",
    description: "Analyze repos, commit cadence, languages, and READMEs.",
    icon: "🐙",
    inputType: "link",
    linkPlaceholder: "https://github.com/your-username",
  },
  {
    key: "leetcode",
    name: "LeetCode",
    description: "Track solved problems, difficulty mix, and contest rating.",
    icon: "🟠",
    inputType: "link",
    linkPlaceholder: "https://leetcode.com/u/your-username",
  },
  {
    key: "resume",
    name: "Resume",
    description: "Parse your resume for skills, impact, and formatting.",
    icon: "📄",
    inputType: "upload",
    acceptedTypes: ".pdf,.doc,.docx",
    uploadHint: "PDF or Word · max 10 MB",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    description: "Pull experience and endorsements for context.",
    icon: "💼",
    inputType: "link",
    linkPlaceholder: "https://linkedin.com/in/your-profile",
  },
  {
    key: "portfolio",
    name: "Portfolio site",
    description: "Let the AI review your personal site and case studies.",
    icon: "🌐",
    inputType: "link",
    linkPlaceholder: "https://your-portfolio.com",
  },
  {
    key: "transcript",
    name: "Transcript",
    description: "Add relevant coursework to strengthen fundamentals.",
    icon: "🎓",
    inputType: "upload",
    acceptedTypes: ".pdf",
    uploadHint: "PDF · max 10 MB",
  },
];

export const targetRoles: TargetRole[] = [
  { id: "swe", title: "Software Engineer Intern", match: 78 },
  { id: "ml", title: "Machine Learning Intern", match: 61 },
  { id: "fullstack", title: "Full-Stack New Grad", match: 74 },
];

export const roleOptions: string[] = [
  "Software Engineer Intern",
  "Full-Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "DevOps / Platform Engineer",
  "Mobile Engineer",
  "Security Engineer",
  "Site Reliability Engineer",
];

export const skillSuggestions: string[] = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Java",
  "C++",
  "Go",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "TensorFlow",
  "PyTorch",
];

export function getUserInitials(name: string): string {
  if (!name) return "";
  const nameParts = name.trim().split(/\s+/);
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());

  if (initials.length > 1) {
    return initials[0] + initials[initials.length - 1];
  }
  return initials[0] || "";
}