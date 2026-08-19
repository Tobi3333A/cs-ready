import { createClient } from "@/lib/supabase/server";
import {
  parseStoredFile,
  type FileKey,
  type StoredFile,
} from "@/lib/integrations";

type AttachedFileEntry = [FileKey, StoredFile];

type StudentReadinessContext = {
  overall: number;
  categories: {
    dsa: number;
    projects: number;
    github: number;
    systemDesign: number;
    resume: number;
    behavioral: number;
  };
  insightHeadline: string;
  insights: string;
  roleFits: unknown;
  assessedAt: string;
};

type StudentSignals = {
  profileLinks: Record<string, string>;
  files: AttachedFileEntry[];
  attachedFiles: Record<string, { fileName: string; mimeType: string }>;
  profile: {
    name: string;
    grade: string;
    school: string;
    skills: string[];
    targetRoles: string[];
  };
  readiness: StudentReadinessContext | null;
};

type StudentSignalsResult =
  | { ok: true; data: StudentSignals }
  | { ok: false; error: string };

export async function fetchStudentSignals(
  userId: string
): Promise<StudentSignalsResult> {
  const supabase = await createClient();

  const [
    { data: integrations, error: integrationsErr },
    { data: profile, error: profileErr },
    { data: readiness, error: readinessErr },
  ] = await Promise.all([
    supabase
      .from("integrations")
      .select("github, leetcode, linkedin, portfolio, resume, transcript")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, grade, school, skills, target")
      .eq("id", userId)
      .single(),
    supabase
      .from("readiness_breakdown")
      .select(
        "overall_readiness, dsa, projects, github, system, resume, behavior, insight_headline, insights, role_fits, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (integrationsErr) return { ok: false, error: "Error fetching user integrations" };
  if (profileErr) return { ok: false, error: "Error fetching profile" };
  if (readinessErr) return { ok: false, error: "Error fetching readiness scores" };

  const profileLinks = Object.fromEntries(
    Object.entries({
      github: integrations?.github ?? null,
      leetcode: integrations?.leetcode ?? null,
      linkedin: integrations?.linkedin ?? null,
      portfolio: integrations?.portfolio ?? null,
    }).filter(([, url]) => typeof url === "string" && url.trim().length > 0)
  ) as Record<string, string>;

  const files = (
    [
      ["resume", parseStoredFile(integrations?.resume)],
      ["transcript", parseStoredFile(integrations?.transcript)],
    ] as const
  ).filter(
    (entry): entry is AttachedFileEntry => entry[1] != null
  );

  const attachedFiles = Object.fromEntries(
    files.map(([key, file]) => [
      key,
      { fileName: file.fileName, mimeType: file.mimeType },
    ])
  );

  return {
    ok: true,
    data: {
      profileLinks,
      files,
      attachedFiles,
      profile: {
        name: profile.full_name,
        grade: profile.grade,
        school: profile.school,
        skills: profile.skills ?? [],
        targetRoles: profile.target ?? [],
      },
      readiness: readiness
        ? {
            overall: readiness.overall_readiness,
            categories: {
              dsa: readiness.dsa,
              projects: readiness.projects,
              github: readiness.github,
              systemDesign: readiness.system,
              resume: readiness.resume,
              behavioral: readiness.behavior,
            },
            insightHeadline: readiness.insight_headline,
            insights: readiness.insights,
            roleFits: readiness.role_fits,
            assessedAt: readiness.created_at,
          }
        : null,
    },
  };
}

export function buildStudentContext(signals: StudentSignals) {
  return {
    profile: signals.profile,
    profileLinks: signals.profileLinks,
    attachedFiles: signals.attachedFiles,
    readiness: signals.readiness,
  };
}

export function describeAttachedFiles(files: AttachedFileEntry[]) {
  return files.map(([key, file]) => `${key} (${file.fileName})`).join(", ");
}

export function buildFileParts(files: AttachedFileEntry[]) {
  return files.map(([, file]) => ({
    type: "file" as const,
    data: file.providerReference,
    mediaType: file.mimeType,
    filename: file.fileName,
  }));
}

export function buildUserContentWithFiles(
  files: AttachedFileEntry[],
  textWhenAttached: string,
  textWhenEmpty: string
) {
  if (files.length === 0) {
    return [{ type: "text" as const, text: textWhenEmpty }];
  }

  return [
    { type: "text" as const, text: textWhenAttached },
    ...buildFileParts(files),
  ];
}
