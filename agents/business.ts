import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import type { OnboardingAnswers } from "@/types";

interface ExtractedBusinessProfile {
  businessName: string;
  industry: string | null;
  location: string | null;
  products: { name: string; description: string; price: string | null }[];
  services: { name: string; description: string; price: string | null }[];
  targetAudience: string | null;
  usp: string | null;
  brandTone: string | null;
  mission: string | null;
  vision: string | null;
  goals: string[];
  monthlyBudget: number | null;
  preferredChannels: string[];
  flags: string[];
}

/** Turns raw onboarding answers into a structured, permanent business profile. */
export async function understandBusiness(workspaceId: string, answers: OnboardingAnswers) {
  const extracted = await runCapabilityJSON<ExtractedBusinessProfile>(
    "business",
    JSON.stringify(answers, null, 2),
  );

  const profile = await db.businessProfile.upsert({
    where: { workspaceId },
    create: {
      workspaceId,
      businessName: extracted.businessName || answers.businessName,
      industry: extracted.industry,
      website: answers.website,
      socialLinks: answers.socialLinks ?? {},
      products: extracted.products,
      services: extracted.services,
      targetAudience: extracted.targetAudience,
      usp: extracted.usp,
      brandTone: extracted.brandTone ?? answers.brandTone,
      mission: extracted.mission,
      vision: extracted.vision,
      location: extracted.location,
      monthlyBudget: extracted.monthlyBudget ?? answers.monthlyBudget,
      preferredChannels: extracted.preferredChannels?.length
        ? extracted.preferredChannels
        : answers.preferredChannels,
      goals: extracted.goals?.length ? extracted.goals : answers.goals,
      rawOnboarding: answers as unknown as object,
    },
    update: {
      businessName: extracted.businessName || answers.businessName,
      industry: extracted.industry,
      website: answers.website,
      socialLinks: answers.socialLinks ?? {},
      products: extracted.products,
      services: extracted.services,
      targetAudience: extracted.targetAudience,
      usp: extracted.usp,
      brandTone: extracted.brandTone ?? answers.brandTone,
      mission: extracted.mission,
      vision: extracted.vision,
      location: extracted.location,
      monthlyBudget: extracted.monthlyBudget ?? answers.monthlyBudget,
      preferredChannels: extracted.preferredChannels?.length
        ? extracted.preferredChannels
        : answers.preferredChannels,
      goals: extracted.goals?.length ? extracted.goals : answers.goals,
      rawOnboarding: answers as unknown as object,
    },
  });

  return { profile, flags: extracted.flags };
}
