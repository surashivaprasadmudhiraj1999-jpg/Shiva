import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

interface ClerkUserEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  const body = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: ClerkUserEvent;
  try {
    event = new Webhook(webhookSecret).verify(body, headers) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    await db.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
        avatarUrl: image_url,
      },
      update: {
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
        avatarUrl: image_url,
      },
    });
  }

  if (event.type === "user.deleted") {
    await db.user.deleteMany({ where: { clerkId: event.data.id } });
  }

  return NextResponse.json({ received: true });
}
