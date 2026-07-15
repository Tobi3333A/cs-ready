import { Output, generateText, tool } from "ai";
import { z } from 'zod'

export async function POST(req: Request) {

    const { output } = await generateText({
        model: 'openai/gpt-4.1-mini',
        prompt: '',
        output: Output.object({
            schema: z.object({
                target: z.string().describe(''),
                now: z.number().describe(''),
                goal: z.number().describe(''),
                steps: z.array(
                    
                )
            })
        })
    })
}