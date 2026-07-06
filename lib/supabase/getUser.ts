import { createClient } from "./server";

export async function getUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        return null
    }
    return user;
}