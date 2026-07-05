import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/supabase/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
