import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import { Output, generateText, gateway, stepCountIs } from "ai";
import { revalidatePath } from "next/cache";
import { z } from 'zod'

export async function POST() {
    const user = await getUser();
    if (!user) return Response.json({ error: 'You must be signed in' }, { status: 200 });

    const supabase = await createClient();

    const [
        { data: integrations, error: integrationsErr },
        { data: readiness, error: readinessErr },
        { data: profile, error: profileErr },
    ] = await Promise.all([
        supabase
            .from('integrations')
            .select('github, leetcode, linkedin, portfolio')
            .eq('user_id', user.id)
            .maybeSingle(),
        supabase
            .from('readiness_breakdown')
            .select('overall_readiness, dsa, projects, github, system, resume, behavior, insight_headline, insights, role_fits')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase
            .from('profiles')
            .select('full_name, grade, school, skills, target')
            .eq('id', user.id)
            .single(),
    ]);

    if (integrationsErr) return Response.json({ error: 'Error fetching user integrations' }, { status: 200 });
    if (readinessErr) return Response.json({ error: 'Error fetching readiness scores' }, { status: 200 });
    if (profileErr) return Response.json({ error: 'Error fetching profile' }, { status: 200 });

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
            }
            : null,
        profileLinks,
    };

    console.log('[roadmap] profileLinks', profileLinks);

    const { output, steps } = await generateText({
        model: 'openai/gpt-4.1-mini',
        stopWhen: stepCountIs(8),
        onStepEnd({ stepNumber, finishReason, toolCalls, toolResults }) {
            console.log(
                '[roadmap] step end',
                JSON.stringify(
                    { stepNumber, finishReason, toolCalls, toolResults },
                    null,
                    2
                )
            );
        },
        prompt: `You are an expert career coach for CS-Ready, an AI readiness platform that helps computer science students land software engineering internships and new-grad roles.

Your job is to produce a personalized roadmap that moves a student from their current readiness score to a competitive or standout level (85+). Readiness is scored 0–100 across six categories: Data Structures & Algorithms, Projects & Portfolio, Open Source & GitHub, System Design, Resume & Experience, and Behavioral & Communication skills.

You decide the timeframe and cadence. Do NOT default to any fixed length—choose whatever pace genuinely fits this student's gap between their current and target readiness. It might span a few days, a couple of weeks, several weeks, or longer, and steps can be daily, weekly, or any interval you judge appropriate. Base this entirely on how much ground the student realistically needs to cover.

Student context (JSON):
${JSON.stringify(studentContext)}

Research rules:
- For each URL in profileLinks, call perplexity_search to inspect that profile before writing tasks.
- When calling perplexity_search:
  - Set query to the exact full URL from profileLinks (e.g. "https://github.com/Tobi3333A"), not a shortened or fuzzy name.
  - Do NOT set search_after_date, search_before_date, or search_recency_filter—leave results unrestricted by date.
  - Prefer search_domain_filter only when it matches the link host (e.g. ["github.com"] for a GitHub URL).
- After results return, keep ONLY pages whose URL clearly belongs to that same profile/username/path. Discard lookalikes (e.g. github.com/tobi/... is NOT github.com/Tobi3333A/...).
- If no result clearly matches the linked profile, treat that signal as UNVERIFIED—not empty. Say the profile could not be verified from search. Do not invent repo counts, READMEs, or claim the account is empty.
- Skip keys that are missing from profileLinks—do not invent GitHub repos, LeetCode stats, jobs, or projects.
- Base concrete tasks on verified search evidence plus the readiness/profile data above. Prefer readiness scores and profile fields when search is unverified.
- If readiness is present, set now to overall and prioritize the lowest category scores first.
- If readiness is null, estimate now conservatively from available signals and note uncertainty only in task specificity—not in the schema fields.
- Align the target sentence and goal with the student's targetRoles when available.

Guidelines:
- Decide how many sequential steps the roadmap needs and how long the overall journey should take—there is no required number of steps or total duration. Pick what the student's gap actually warrants.
- Each step must include 3–5 specific, actionable tasks—not vague advice. Name concrete deliverables, counts, or topics (e.g., "Solve 5 medium graph problems on LeetCode" or "Add an architecture diagram and demo GIF to your top pinned repo").
- Address the student's weakest categories first, then progress toward interview-ready polish.
- Structure the arc: foundational gaps → targeted skill building → portfolio and resume refinement → mock interviews and final prep.
- Each step's tasks should be realistic for the amount of focused effort that step's timeframe implies.
- sort_order must start at 0 and increment by 1 for each step.
- now and goal must be integers from 0 to 100 representing overall readiness scores. goal should typically be 85 or higher.
- target must be one motivating sentence summarizing the journey, including the timeframe you chose (e.g., "Reach an 85+ readiness score in 3 weeks for Software Engineer Intern interviews").
- timeline labels must reflect the cadence you chose and stay consistent across steps (e.g., "Week 1", "Week 2" for a weekly plan, or "Day 1", "Day 2" for a short daily sprint).
- Titles should be short and action-oriented. Descriptions must be 1–2 sentences and MUST ground the reason in a specific observation from THIS student's data—cite readiness scores, profile fields, or verified connected-profile evidence (e.g. "Your DSA score of 42 is your lowest category", "Search could not verify your GitHub link, so prioritize making repos discoverable"). Do not invent empty-profile details. If a signal was missing or unverified, say that plainly.
- Be direct, encouraging, and practical—no filler or generic platitudes.

After finishing research, output only the structured object matching the schema. Do not include markdown, commentary, or text outside the schema.`,
        output: Output.object({
            schema: z.object({
                target: z.string().describe('A single motivating sentence summarizing the student\'s end goal, including the target score and the timeframe you chose for this roadmap (e.g., "Reach an 85+ readiness score in 3 weeks for Software Engineer Intern interviews").'),
                now: z.number().describe('The student\'s current overall readiness score as an integer from 0 to 100.'),
                goal: z.number().describe('The target overall readiness score to achieve by the end of the roadmap, as an integer from 0 to 100 (typically 85 or higher).'),
                steps: z.array(
                    z.object({
                        timeline: z.string().describe('A human-readable time label for this phase, shown in the UI timeline, matching the cadence you chose for the roadmap (e.g., "Week 1", "Week 2", or "Day 1", "Day 2").'),
                        title: z.string().describe('A short, action-oriented heading for this roadmap phase (e.g., "Close the Graph & DP Gap").'),
                        description: z.string().describe('One to two sentences. MUST justify this phase with a specific observation from THIS student\'s data—readiness scores, profile fields, or verified connected-profile evidence. If a linked profile could not be verified via search, say so instead of inventing emptiness (e.g. "Your DSA score of 42 is the lowest category" or "Your GitHub link could not be verified from search").'),
                        sort_order: z.number().describe('Zero-based display order for this step; 0 is the first week, incrementing by 1 for each subsequent step.'),
                        tasks: z.array(
                            z.object({
                                task: z.string().describe('A specific, completable action item for this week—include counts, topics, or deliverables where possible.')
                            })
                        )
                    })
                )
            })
        }),
        tools: {
            perplexity_search: gateway.tools.perplexitySearch({
                maxResults: 5,
            }),
        },
    });

    console.log(
        '[roadmap] generation summary',
        JSON.stringify(
            {
                stepCount: steps.length,
                toolCallCount: steps.reduce((n, s) => n + s.toolCalls.length, 0),
                toolResultCount: steps.reduce((n, s) => n + s.toolResults.length, 0),
                toolCalls: steps.flatMap((s) => s.toolCalls),
                toolResults: steps.flatMap((s) => s.toolResults),
            },
            null,
            2
        )
    );

    if (!output) {
        return Response.json({ error: 'Failed to generate roadmap' }, { status: 200 });
    }

    const { data: roadmap, error: roadmapErr } = await supabase
        .from('roadmap')
        .insert({
            user_id: user.id,
            target: output.target,
            now: output.now,
            goal: output.goal
        })
        .select('id')
        .single()
    if (roadmapErr) return Response.json({ error: 'Error inserting roadmap' }, { status: 200 });

    for (const step of output.steps) {
        const { data: stepData, error: stepErr } = await supabase
            .from('roadmap_steps')
            .insert({
                roadmap_id: roadmap.id,
                timeline: step.timeline,
                title: step.title,
                description: step.description,
                sort_order: step.sort_order
            })
            .select('id')
            .single()
        if (stepErr) return Response.json({ error: 'Error inserting roadmap step' }, { status: 200 });
        
        for (const task of step.tasks) {
            const { error: taskErr } = await supabase
                .from('roadmap_tasks')
                .insert({
                    roadmap_step_id: stepData.id,
                    task: task.task
                });
            if (taskErr) return Response.json({ error: 'Error inserting tasks' }, { status: 200 });
        }
    }

    revalidatePath('/dashboard/roadmap');
    return Response.json({ success: true })
}