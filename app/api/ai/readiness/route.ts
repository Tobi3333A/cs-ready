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
        prompt: '',
        output: Output.object({
            schema: z.object({
                insightTitle: z.string().describe(''),
                insightBody: z.string().describe(''),
                overallScore: z.number().describe(''),
                dsaScore: z.number().describe(''),
                githubScore: z.number().describe(''),
                projectScore: z.number().describe(''),
                systemDesignScore: z.number().describe(''),
                resumeScore: z.number().describe(''),
                behavioralReadinessScore: z.number().describe(''),
                roleFitScore: z.object({

                })
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