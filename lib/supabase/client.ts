import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createClient(): SupabaseClient<Database> | null {
    // Guard against SSR prerendering — env vars are only meaningful in the browser
    if (typeof window === "undefined") return null;

    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
