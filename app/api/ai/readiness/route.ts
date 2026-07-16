import { getUser } from '@/lib/supabase/getUser';
import { createClient } from '@/lib/supabase/server';
import { Output, generateText, gateway, stepCountIs } from 'ai';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function POST() {
    const user = await getUser();
    if (!user) return Response.json({ error: 'You must be signed in' }, { status: 200 });

    const supabase = await createClient();

    const [
        { data: integrations, error: integrationsErr },
        { data: profile, error: profileErr },
        { data: previousReadiness, error: readinessErr },
    ] = await Promise.all([
        supabase
            .from('integrations')
            .select('github, leetcode, linkedin, portfolio, resume, transcript')
            .eq('user_id', user.id)
            .maybeSingle(),
        supabase
            .from('profiles')
            .select('full_name, grade, school, skills, target')
            .eq('id', user.id)
            .single(),
        supabase
            .from('readiness_breakdown')
            .select('overall_readiness, dsa, projects, github, system, resume, behavior, insight_headline, insights, role_fits, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    if (integrationsErr) return Response.json({ error: 'Error fetching user integrations' }, { status: 200 });
    if (profileErr) return Response.json({ error: 'Error fetching profile' }, { status: 200 });
    if (readinessErr) return Response.json({ error: 'Error fetching previous readiness' }, { status: 200 });

    const profileLinks = Object.fromEntries(
        Object.entries({
            github: integrations?.github ?? null,
            leetcode: integrations?.leetcode ?? null,
            linkedin: integrations?.linkedin ?? null,
            portfolio: integrations?.portfolio ?? null,
        }).filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
    );

    const studentContext = {
        profile: {
                name: profile.full_name,
                grade: profile.grade,
                school: profile.school,
                skills: profile.skills ?? [],
                targetRoles: profile.target ?? [],
            },
        profileLinks,
        previousReadiness: previousReadiness
            ? {
                overall: previousReadiness.overall_readiness,
                categories: {
                    dsa: previousReadiness.dsa,
                    projects: previousReadiness.projects,
                    github: previousReadiness.github,
                    systemDesign: previousReadiness.system,
                    resume: previousReadiness.resume,
                    behavioral: previousReadiness.behavior,
                },
                insightHeadline: previousReadiness.insight_headline,
                insights: previousReadiness.insights,
                roleFits: previousReadiness.role_fits,
                assessedAt: previousReadiness.created_at,
            }
            : null,
    };

    const { output } = await generateText({
        model: 'openai/gpt-4.1-mini',
        stopWhen: stepCountIs(8),
        prompt: `You are an expert career coach for CS-Ready, an AI readiness platform that helps computer science students land software engineering internships and new-grad roles.

Your job is to analyze a student's profile signals and produce an honest readiness assessment. Readiness is scored 0–100 across six categories: Data Structures & Algorithms, Projects & Portfolio, Open Source & GitHub, System Design, Resume & Experience, and Behavioral & Communication skills.

Student context (JSON):
${JSON.stringify(studentContext)}

Research rules:
- For each URL in profileLinks, call perplexity_search to inspect that profile before scoring.
- Skip keys that are missing from profileLinks—do not invent GitHub repos, LeetCode stats, jobs, projects, or experience.
- Score only from evidence found via search plus the profile/upload flags above.
- If uploads.resume.uploaded is false, score Resume & Experience conservatively and say the resume is missing in the insight.
- If uploads.transcript.uploaded is false, do not invent coursework; note the gap only when relevant.
- Align overallScore weighting and roleFitScore with the student's targetRoles when available.
- If previousReadiness is present, treat it as the student's last assessment for context (what improved, what stayed weak). Re-score from current evidence—do not copy old scores blindly—but you may reference meaningful changes in insightBody when useful.

Guidelines:
- Score each category as an integer from 0 to 100 based only on evidence in the student's connected signals and profile.
- overallScore must be a weighted blend of the six category scores, emphasizing categories that matter most for the student's stated target roles—not a simple average.
- Be honest and specific. Do not inflate scores without evidence. When signals are missing or thin, score conservatively and note what is unknown in the insight.
- insightTitle must be one short, direct headline (roughly 5–12 words) naming the student's biggest gap or opportunity, grounded in something concrete you observed (e.g., "GitHub is thin—only 2 repos, no READMEs").
- insightBody must be 2–4 sentences in second person. MUST cite specific observations from THIS student's data—what you actually saw in their LinkedIn/GitHub/LeetCode/portfolio/profile (e.g. problem difficulty mix, repo count, missing resume). Name the highest-impact gap and one concrete next step. If previousReadiness exists and scores moved, briefly note the change with evidence. No generic platitudes.
- roleFitScore must include every target role from the student's profile, each with a match percentage (0–100) for how ready they are for that role today. If targetRoles is empty, return one generic "Software Engineer Intern" entry with a cautious match.
- If little or no signal data is provided, still output valid scores but note low confidence briefly in insightBody and use cautious mid-range scores with clear caveats.
- Be direct, encouraging, and practical—like a recruiter who wants them to succeed.

After finishing research, output only the structured object matching the schema. Do not include markdown, commentary, or text outside the schema.`,
        output: Output.object({
            schema: z.object({
                insightTitle: z.string().describe('A short, direct dashboard headline (roughly 5–12 words) naming the student\'s biggest readiness gap or opportunity, grounded in a concrete observation (e.g., "Your projects are strong—DSA is the bottleneck").'),
                insightBody: z.string().describe('Two to four sentences in second person. MUST cite specific observations from THIS student\'s signals (what you actually saw on GitHub/LeetCode/LinkedIn/portfolio/profile or that a signal was missing), name the highest-impact gap, and give one specific next action. No generic advice.'),
                overallScore: z.number().describe('The student\'s overall readiness score as an integer from 0 to 100, weighted toward categories that matter most for their target roles.'),
                dsaScore: z.number().describe('Data Structures & Algorithms readiness (0–100), based on problem-solving depth, difficulty mix, and patterns seen in LeetCode or equivalent signals.'),
                githubScore: z.number().describe('Open Source & GitHub readiness (0–100), based on repo quality, commit consistency, README depth, and visible engineering habits.'),
                projectScore: z.number().describe('Projects & Portfolio readiness (0–100), based on project complexity, live demos, tech stack relevance, and portfolio presentation.'),
                systemDesignScore: z.number().describe('System Design readiness (0–100), based on evidence of architecture thinking, scalability awareness, and design trade-offs in projects or coursework.'),
                resumeScore: z.number().describe('Resume & Experience readiness (0–100), based on clarity, quantified impact, relevant experience, and alignment with target roles—or conservative if resume was not uploaded.'),
                behavioralReadinessScore: z.number().describe('Behavioral & Communication readiness (0–100), based on leadership signals, collaboration evidence, and how well they can articulate experience in interviews.'),
                roleFitScore: z.array(
                    z.object({
                        role: z.string().describe('A target role from the student\'s profile (e.g., "Software Engineer Intern").'),
                        match: z.number().describe('How well the student\'s current signals fit this role today, as an integer from 0 to 100.'),
                    })
                ).describe('Fit scores for each target role the student is pursuing, weighted by the category strengths that role demands.'),
            })
        }),
        tools: {
            perplexity_search: gateway.tools.perplexitySearch({
                maxResults: 5,
            }),
        },
    });

    if (!output) {
        return Response.json({ error: 'Failed to generate readiness score' }, { status: 200 });
    }

    const { data, error: insErr } = await supabase
        .from('readiness_breakdown')
        .insert({
            user_id: user.id,
            overall_readiness: output.overallScore,
            insight_headline: output.insightTitle,
            insights: output.insightBody,
            dsa: output.dsaScore,
            github: output.githubScore,
            projects: output.projectScore,
            system: output.systemDesignScore,
            resume: output.resumeScore,
            behavior: output.behavioralReadinessScore,
            role_fits: output.roleFitScore
        })
        .select('id')
        .single()

    if (insErr || !data) return Response.json({ error: insErr?.message ?? 'Error saving readiness' }, { status: 200 });

    revalidatePath('/dashboard');
    return Response.json({ success: true });
}
