import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { allowed, clientIp, tooManyRequests } from "@/lib/rate-limit-db";

export async function GET(request: NextRequest) {
    // Throttle in the database: it is the only limiter shared by every serverless instance.
    if (!(await allowed(`check-email:ip:${clientIp(request)}`, 10, 900))) {
        return tooManyRequests();
    }

    const email = request.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ exists: false });

    const admin = createAdminClient();
    const { data: userId } = await admin.rpc("get_user_id_by_email", { p_email: email });
    return NextResponse.json({ exists: !!userId });
}
