"use server";

import { createClient } from "@/lib/supabase/server";

type FormState = {
  ok: boolean;
  message?: string
};

export async function signup(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const grade = String(formData.get("grade") ?? "Freshman");

  if (!firstName || !lastName || !email || !school || !password) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const fullName = `${firstName} ${lastName}`.trim();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        school,
        grade,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: 'Signup successful! You should receive a verification email.'}
}
