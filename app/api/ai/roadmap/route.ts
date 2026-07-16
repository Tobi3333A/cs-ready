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

    const { output } = await generateText({
        model: 'openai/gpt-4.1-mini',
        stopWhen: stepCountIs(8),
        prompt: `You are an expert career coach for CS-Ready, an AI readiness platform that helps computer science students land software engineering internships and new-grad roles.

Your job is to produce a personalized 6-week roadmap that moves a student from their current readiness score to a competitive or standout level (85+). Readiness is scored 0–100 across six categories: Data Structures & Algorithms, Projects & Portfolio, Open Source & GitHub, System Design, Resume & Experience, and Behavioral & Communication skills.

Student context (JSON):
${JSON.stringify(studentContext)}

Research rules:
- For each URL in profileLinks, call perplexity_search to inspect that profile before writing tasks.
- Skip keys that are missing from profileLinks—do not invent GitHub repos, LeetCode stats, jobs, or projects.
- Base concrete tasks on what you find via search plus the readiness/profile data above.
- If readiness is present, set now to overall and prioritize the lowest category scores first.
- If readiness is null, estimate now conservatively from available signals and note uncertainty only in task specificity—not in the schema fields.
- Align the target sentence and goal with the student's targetRoles when available.

Guidelines:
- Generate exactly 6 sequential weekly steps (Week 1 through Week 6).
- Each step must include 3–5 specific, actionable tasks—not vague advice. Name concrete deliverables, counts, or topics (e.g., "Solve 5 medium graph problems on LeetCode" or "Add an architecture diagram and demo GIF to your top pinned repo").
- Address the student's weakest categories first, then progress toward interview-ready polish.
- Structure the arc: foundational gaps → targeted skill building → portfolio and resume refinement → mock interviews and final prep.
- Tasks should be realistic for one week of focused effort by a busy CS student.
- sort_order must start at 0 and increment by 1 for each step.
- now and goal must be integers from 0 to 100 representing overall readiness scores. goal should typically be 85 or higher.
- target must be one motivating sentence summarizing the journey (e.g., "Reach an 85+ readiness score in 6 weeks for Software Engineer Intern interviews").
- timeline labels must be "Week 1" through "Week 6".
- Titles should be short and action-oriented. Descriptions must be 1–2 sentences and MUST ground the reason in a specific observation from THIS student's data—cite what you actually saw in their readiness scores, profile, or connected profiles (e.g. "Your GitHub shows only one pinned repo with no README", "Your LeetCode is mostly easy problems with few graph questions", "Your DSA score of 42 is your lowest category"). Do not give generic reasons; every step's reason must reference real evidence about this student, and if a signal was missing say so plainly.
- Be direct, encouraging, and practical—no filler or generic platitudes.

After finishing research, output only the structured object matching the schema. Do not include markdown, commentary, or text outside the schema.`,
        output: Output.object({
            schema: z.object({
                target: z.string().describe('A single motivating sentence summarizing the student\'s end goal, including the target score and timeframe (e.g., "Reach an 85+ readiness score in 6 weeks for Software Engineer Intern interviews").'),
                now: z.number().describe('The student\'s current overall readiness score as an integer from 0 to 100.'),
                goal: z.number().describe('The target overall readiness score to achieve by the end of the roadmap, as an integer from 0 to 100 (typically 85 or higher).'),
                steps: z.array(
                    z.object({
                        timeline: z.string().describe('A human-readable time label for this phase, shown in the UI timeline (e.g., "Week 1", "Week 2").'),
                        title: z.string().describe('A short, action-oriented heading for this roadmap phase (e.g., "Close the Graph & DP Gap").'),
                        description: z.string().describe('One to two sentences. MUST justify this phase with a specific observation from THIS student\'s data—reference what was actually seen in their readiness scores, profile, or connected profiles (e.g. "Your GitHub has no READMEs and only 2 repos" or "Your DSA score of 42 is the lowest category"). No generic rationale; if a signal was missing, state that instead.'),
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