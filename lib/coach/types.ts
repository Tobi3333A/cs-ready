/** Snapshot passed from the server for the context panel. */
export type CoachProfileContext = {
  firstName: string;
  initials: string;
  overallScore?: number;
  levelLabel?: string;
  insightHeadline?: string;
  weakestCategory?: { label: string; score: number };
};

/** Sidebar / list row for a conversation (messages loaded separately). */
export type CoachConversationSummary = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
};
