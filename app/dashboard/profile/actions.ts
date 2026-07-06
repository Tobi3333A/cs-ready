'use server'

import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import { FormState } from "@/lib/types";

export async function profile(_prevState: FormState, formData: FormData): Promise<FormState> {
    const user = await getUser();
    if (!user) return { ok: false, message: 'You must be signed in' };

    const name = String(formData.get('name') ?? '').trim();
    const school = String(formData.get('school') ?? '').trim();
    const grade = String(formData.get('grade') ?? '').trim();
    const skills = String(formData.get('skills') ?? '[]');
    const target = String(formData.get('target') ?? '[]');

    if (!name || !grade) return { ok: false, message: 'Please put in your name and grade' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: name,
            grade,
            skills: JSON.parse(skills) as string[],
            target: JSON.parse(target) as string[]
        })
        .eq('id', user.id);
    
    if (error) return { ok: false, message: 'Error saving changes' };

    return { ok: true, message: 'Profile updated successfully!' };
}