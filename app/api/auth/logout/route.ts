/**
 * POST /api/auth/logout
 *
 * Signs out via the SSR client so the session cookies are cleared
 * in the response headers.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true }, { status: 200 });
}
