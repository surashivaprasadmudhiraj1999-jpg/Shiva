// Shared types for the AI Marketing Employee's internal capabilities.
// These never leak to the UI as "agents" — the user only ever sees one AI.

export type CapabilityName =
  | "manager"
  | "business"
  | "research"
  | "competitors"
  | "customer"
  | "strategy"
  | "planner"
  | "content"
  | "analytics"
  | "learning";

export interface WorkspaceContext {
  workspaceId: string;
  businessProfile?: Record<string, unknown> | null;
  brandVoice?: string | null;
}

export interface OnboardingAnswers {
  businessName: string;
  industry?: string;
  website?: string;
  productOrService: string;
  customers: string;
  differentiator?: string;
  competitors?: string;
  goals: string[];
  monthlyBudget?: number;
  preferredChannels: string[];
  brandTone?: string;
  socialLinks?: Record<string, string>;
  anythingElse?: string;
}

export interface ResearchReport {
  title: string;
  summary: string;
  painPoints: string[];
  trends: string[];
  searchDemand: string[];
  seasonality?: string;
  language: string[];
  sources: { title: string; url?: string }[];
}

export interface CompetitorProfile {
  name: string;
  website?: string;
  pricing?: Record<string, unknown>;
  strengths: string[];
  weaknesses: string[];
  positioning: string;
  messaging: string;
  opportunities: string[];
}

export interface PersonaProfile {
  name: string;
  demographics: Record<string, unknown>;
  psychographics: Record<string, unknown>;
  goals: string[];
  painPoints: string[];
  frustrations: string[];
  dreamOutcomes: string[];
  buyingMotivations: string[];
  objections: string[];
  favoritePlatforms: string[];
  decisionTriggers: string[];
}

export interface StrategyPlan {
  title: string;
  overview: string;
  seoStrategy: Record<string, unknown>;
  socialStrategy: Record<string, unknown>;
  emailStrategy: Record<string, unknown>;
  contentStrategy: Record<string, unknown>;
  ninetyDayPlan: Record<string, unknown>;
  quarterlyGoals: Record<string, unknown>;
  priorityChannels: string[];
  kpis: Record<string, unknown>;
}

export interface DailyPriority {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}
