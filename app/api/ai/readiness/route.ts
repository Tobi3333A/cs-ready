import { getUser } from '@/lib/supabase/getUser';
import { createClient } from '@/lib/supabase/server';
import { Output, generateText, tool } from 'ai';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function POST(req: Request) {

    const user = await getUser();
    if (!user) redirect('/login');

    const { output } = await generateText({
        model: 'openai/gpt-4.1-mini',
        prompt: `You are an expert career coach for CS-Ready, an AI readiness platform that helps computer science students land software engineering internships and new-grad roles.

Your job is to analyze a student's profile signals and produce an honest readiness assessment. Readiness is scored 0–100 across six categories: Data Structures & Algorithms, Projects & Portfolio, Open Source & GitHub, System Design, Resume & Experience, and Behavioral & Communication skills.

Guidelines:
- Score each category as an integer from 0 to 100 based only on evidence in the student's connected signals (GitHub, LeetCode, resume, LinkedIn, portfolio, transcript) and profile (target roles, grade, skills).
- overallScore must be a weighted blend of the six category scores, emphasizing categories that matter most for the student's stated target roles—not a simple average.
- Be honest and specific. Do not inflate scores without evidence. When signals are missing or thin, score conservatively and note what is unknown in the insight.
- insightTitle must be one short, direct headline (roughly 5–12 words) naming the student's biggest gap or opportunity for the dashboard hero card.
- insightBody must be 2–4 sentences: what you see in their signals, the highest-impact gap, and one concrete next step. No generic platitudes.
- roleFitScore must include every target role from the student's profile, each with a match percentage (0–100) for how ready they are for that role today.
- If little or no signal data is provided, still output valid scores but note low confidence briefly in insightBody and use cautious mid-range scores with clear caveats.
- Be direct, encouraging, and practical—like a recruiter who wants them to succeed.

Output only the structured object matching the schema. Do not include markdown, commentary, or text outside the schema.`,
        output: Output.object({
            schema: z.object({
                insightTitle: z.string().describe('A short, direct dashboard headline (roughly 5–12 words) naming the student\'s biggest readiness gap or opportunity (e.g., "Your projects are strong—DSA is the bottleneck").'),
                insightBody: z.string().describe('Two to four sentences of AI coach insight: what the signals show, the highest-impact gap, and one specific next action. Written in second person, direct and practical.'),
                overallScore: z.number().describe('The student\'s overall readiness score as an integer from 0 to 100, weighted toward categories that matter most for their target roles.'),
                dsaScore: z.number().describe('Data Structures & Algorithms readiness (0–100), based on problem-solving depth, difficulty mix, and patterns seen in LeetCode or equivalent signals.'),
                githubScore: z.number().describe('Open Source & GitHub readiness (0–100), based on repo quality, commit consistency, README depth, and visible engineering habits.'),
                projectScore: z.number().describe('Projects & Portfolio readiness (0–100), based on project complexity, live demos, tech stack relevance, and portfolio presentation.'),
                systemDesignScore: z.number().describe('System Design readiness (0–100), based on evidence of architecture thinking, scalability awareness, and design trade-offs in projects or coursework.'),
                resumeScore: z.number().describe('Resume & Experience readiness (0–100), based on clarity, quantified impact, relevant experience, and alignment with target roles.'),
                behavioralReadinessScore: z.number().describe('Behavioral & Communication readiness (0–100), based on leadership signals, collaboration evidence, and how well they can articulate experience in interviews.'),
                roleFitScore: z.array(
                    z.object({
                        role: z.string().describe('A target role from the student\'s profile (e.g., "Software Engineer Intern").'),
                        match: z.number().describe('How well the student\'s current signals fit this role today, as an integer from 0 to 100.'),
                    })
                ).describe('Fit scores for each target role the student is pursuing, weighted by the category strengths that role demands.'),
            })
        })
    });

    const supabase = await createClient();

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
            behavior: output.behavioralReadinessScore
        })
        .select('id')
        .single()

    if (insErr || !data) return Response.json({ error: insErr.message }, { status: 200 });

    revalidatePath('/dashboard');
    return Response.json({ success: true });
}