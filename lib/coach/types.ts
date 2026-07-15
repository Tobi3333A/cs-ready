/** Message roles — mirrors what the backend / AI SDK will use. */
export type CoachMessageRole = "user" | "assistant";

export type CoachMessage = {
  id: string;
  role: CoachMessageRole;
  content: string;
  createdAt: string;
};

export type CoachConversation = {
  id: string;
  title: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
};

/** Snapshot passed from the server for the context panel. */
export type CoachProfileContext = {
  firstName: string;
  initials: string;
  overallScore?: number;
  levelLabel?: string;
  insightHeadline?: string;
  weakestCategory?: { label: string; score: number };
};
