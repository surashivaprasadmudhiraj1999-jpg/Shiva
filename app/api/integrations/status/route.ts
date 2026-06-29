import { NextResponse } from "next/server";

// Server-side only. Reports which integrations have credentials configured,
// WITHOUT ever returning the secret values themselves. The frontend can call
// this to decide whether to show live data or labelled demo data.

export const dynamic = "force-dynamic";

function present(...vars: (string | undefined)[]) {
  return vars.every((v) => Boolean(v && v.length > 0));
}

export async function GET() {
  const status = {
    googleSearchConsole: present(process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID, process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET),
    googleAnalytics4: present(process.env.GA4_PROPERTY_ID),
    googleBusinessProfile: present(process.env.GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID),
    dataForSeo: present(process.env.DATAFORSEO_LOGIN, process.env.DATAFORSEO_PASSWORD),
    pageSpeedInsights: present(process.env.PAGESPEED_INSIGHTS_API_KEY),
    slack: present(process.env.SLACK_WEBHOOK_URL),
    email: present(process.env.RESEND_API_KEY),
    supabase: present(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  // Note: only booleans leave the server — never the keys.
  return NextResponse.json({ configured: status, mode: Object.values(status).some(Boolean) ? "partial-live" : "demo" });
}
