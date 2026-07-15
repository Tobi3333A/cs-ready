import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import { Output, generateText, tool } from "ai";
import { revalidatePath } from "next/cache";
import { z } from 'zod'

export async function POST(req: Request) {


    const user = await getUser();
    if (!user) return Response.json({ error: 'You must be signed in' }, { status: 200 });

    const { output } = await generateText({
        model: 'openai/gpt-4.1-mini',
        prompt: `You are an expert career coach for CS-Ready, an AI readiness platform that helps computer science students land software engineering internships and new-grad roles.

Your job is to produce a personalized, week-by-week roadmap that moves a student from their current readiness score to a competitive or standout level (85+). Readiness is scored 0–100 across six categories: Data Structures & Algorithms, Projects & Portfolio, Open Source & GitHub, System Design, Resume & Experience, and Behavioral & Communication skills.

Guidelines:
- Generate exactly 6 sequential weekly steps (Week 1 through Week 6).
- Each step must include 3–5 specific, actionable tasks—not vague advice. Name concrete deliverables, counts, or topics (e.g., "Solve 5 medium graph problems on LeetCode" or "Add an architecture diagram and demo GIF to your top pinned repo").
- Address the student's weakest categories first, then progress toward interview-ready polish.
- Structure the arc: foundational gaps → targeted skill building → portfolio and resume refinement → mock interviews and final prep.
- Tasks should be realistic for one week of focused effort by a busy CS student.
- sort_order must start at 0 and increment by 1 for each step.
- now and goal must be integers from 0 to 100 representing overall readiness scores.
- target must be one motivating sentence summarizing the journey (e.g., "Reach an 85+ readiness score in 6 weeks for Software Engineer Intern interviews").
- timeline labels should read naturally in a UI timeline (e.g., "Week 1", "Week 2", "Week 3").
- Titles should be short and action-oriented. Descriptions should be 1–2 sentences explaining the focus and why it matters.
- Be direct, encouraging, and practical—no filler or generic platitudes.

Output only the structured object matching the schema. Do not include markdown, commentary, or text outside the schema.`,
        output: Output.object({
            schema: z.object({
                target: z.string().describe('A single motivating sentence summarizing the student\'s end goal, including the target score and timeframe (e.g., "Reach an 85+ readiness score in 6 weeks for Software Engineer Intern interviews").'),
                now: z.number().describe('The student\'s current overall readiness score as an integer from 0 to 100.'),
                goal: z.number().describe('The target overall readiness score to achieve by the end of the roadmap, as an integer from 0 to 100 (typically 85 or higher).'),
                steps: z.array(
                    z.object({
                        timeline: z.string().describe('A human-readable time label for this phase, shown in the UI timeline (e.g., "Week 1", "Week 2").'),
                        title: z.string().describe('A short, action-oriented heading for this roadmap phase (e.g., "Close the Graph & DP Gap").'),
                        description: z.string().describe('One to two sentences explaining what this phase focuses on and why it moves the needle on readiness.'),
                        sort_order: z.number().describe('Zero-based display order for this step; 0 is the first week, incrementing by 1 for each subsequent step.'),
                        tasks: z.array(
                            z.object({
                                task: z.string().describe('A specific, completable action item for this week—include counts, topics, or deliverables where possible.')
                            })
                        )
                    })
                )
            })
        })
    });

    const supabase = await createClient();

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