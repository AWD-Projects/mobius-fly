import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ limit: 20, windowMs: 60_000 });

export async function GET(request: NextRequest) {
    const limited = limiter(request);
    if (limited) return limited;

    const email = request.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ exists: false });

    const admin = createAdminClient();
    const { data: userId } = await admin.rpc("get_user_id_by_email", { p_email: email });
    return NextResponse.json({ exists: !!userId });
}
