export const GITHUB_REPO_URL = "https://github.com/Tobi3333A/cs-ready";

export type ReadinessLevel = "emerging" | "developing" | "competitive" | "standout";

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