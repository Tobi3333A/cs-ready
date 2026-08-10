'use server'

import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FILE_BUCKETS, parseStoredFile } from "@/lib/integrations";
import { FormState } from "@/lib/types";

export async function profile(_prevState: FormState, formData: FormData): Promise<FormState> {
    const user = await getUser();
    if (!user) return { ok: false, message: 'You must be signed in' };

    const name = String(formData.get('name') ?? '').trim();
    const school = String(formData.get('school') ?? '').trim();
    const grade = String(formData.get('grade') ?? '').trim();
    const skills = String(formData.get('skills') ?? '[]');
    const target = String(formData.get('target') ?? '[]');

    if (!name || !grade || !school) return { ok: false, message: 'Please put in your name, grade, and school' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: name,
            grade,
            school,
            skills: JSON.parse(skills) as string[],
            target: JSON.parse(target) as string[]
        })
        .eq('id', user.id);
    
    if (error) return { ok: false, message: 'Error saving changes' };

    return { ok: true, message: 'Profile updated successfully!' };
}

async function removeUserStorageFolder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  userId: string,
) {
  const { data: files } = await supabase.storage.from(bucket).list(userId);
  if (!files?.length) return;

  const paths = files.map((file) => `${userId}/${file.name}`);
  await supabase.storage.from(bucket).remove(paths);
}

export async function deleteAccount(): Promise<FormState> {
  const user = await getUser();
  if (!user) return { ok: false, message: "You must be signed in" };

  const supabase = await createClient();
  const userId = user.id;

  const { data: integration } = await supabase
    .from("integrations")
    .select("resume, transcript")
    .eq("user_id", userId)
    .maybeSingle();

  const pathsByBucket: Record<string, string[]> = {
    [FILE_BUCKETS.resume]: [],
    [FILE_BUCKETS.transcript]: [],
  };

  const resume = parseStoredFile(integration?.resume);
  if (resume?.path) pathsByBucket[FILE_BUCKETS.resume].push(resume.path);

  const transcript = parseStoredFile(integration?.transcript);
  if (transcript?.path) pathsByBucket[FILE_BUCKETS.transcript].push(transcript.path);

  for (const [bucket, paths] of Object.entries(pathsByBucket)) {
    if (paths.length) {
      await supabase.storage.from(bucket).remove(paths);
    }
    await removeUserStorageFolder(supabase, bucket, userId);
  }

  const supabaseAdmin = createAdminClient();

  const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authErr) {
    console.error(authErr);
    return { ok: false, message: "Could not delete account" };
  }

  await supabase.auth.signOut();
  redirect("/");
}
