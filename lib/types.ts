// ─────────────────────────────────────────────────────────────
// SearchOS domain types. These mirror the Supabase schema in
// supabase/schema.sql so the demo store can be swapped for live data.
// ─────────────────────────────────────────────────────────────

export type Role = "Owner" | "Editor" | "Viewer";
export type DataOrigin = "demo" | "live" | "manual" | "crawl";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Agency";
  members: User[];
}

export type SearchGoal =
  | "Traffic"
  | "Leads"
  | "Brand visibility"
  | "Local SEO"
  | "AI visibility"
  | "Content growth";

export interface Project {
  id: string;
  name: string;
  domain: string;
  industry: string;
  targetCountry: string;
  targetCity: string;
  language: string;
  audience: string;
  competitors: string[];
  brandName: string;
  productsServices: string;
  goals: SearchGoal[];
  isSample: boolean;
  createdAt: string;
}

export type PriorityLevel = "High" | "Medium" | "Low";
export type TaskStatus = "To do" | "In progress" | "Blocked" | "Done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  category: "SEO" | "AEO" | "GEO" | "Content" | "Technical";
  priority: PriorityLevel;
  impact: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  source: DataOrigin;
  createdAt: string;
}

export interface Insight {
  id: string;
  projectId: string;
  text: string;
  source: string;
  updatedAt: string;
  category: "SEO" | "AEO" | "GEO" | "Competitor";
}

export type AuditStatus = "Passed" | "Warning" | "Critical" | "Not checked";

export interface AuditCheck {
  id: string;
  url: string;
  metric: string;
  value: string;
  status: AuditStatus;
  source: DataOrigin;
}

export type SearchIntent = "Informational" | "Commercial" | "Transactional" | "Navigational";

export interface Keyword {
  id: string;
  projectId: string;
  keyword: string;
  volume: number;
  difficulty: number;
  position: number | null;
  targetUrl: string;
  intent: SearchIntent;
  priority: PriorityLevel;
  contentStatus: "Planned" | "Draft" | "Review" | "Published";
  cluster: string;
  funnelStage: "TOFU" | "MOFU" | "BOFU";
  location: string;
  tags: string[];
  competitorRanking: string;
  source: DataOrigin;
}

export interface ContentBrief {
  id: string;
  projectId: string;
  type:
    | "Blog brief"
    | "Service page"
    | "Location page"
    | "Comparison page"
    | "FAQ page"
    | "Landing page"
    | "Case study"
    | "Content refresh";
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: SearchIntent;
  audience: string;
  funnelStage: "TOFU" | "MOFU" | "BOFU";
  suggestedTitle: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  h1: string;
  outline: { heading: string; level: 2 | 3 }[];
  directAnswer: string;
  faqs: { q: string; a: string }[];
  internalLinks: string[];
  externalSources: string[];
  schema: string;
  competitorGaps: string[];
  cta: string;
  status: "Planned" | "Draft" | "Review" | "Published";
  writer: string;
  deadline: string;
  checklist: Record<string, boolean>;
}

export interface SchemaDraft {
  id: string;
  projectId: string;
  name: string;
  type: string;
  json: string;
  valid: boolean;
  warnings: string[];
  updatedAt: string;
}

export interface Competitor {
  id: string;
  projectId: string;
  name: string;
  domain: string;
  organicVisibility: number;
  rankingKeywords: number;
  topPages: number;
  schemaUsage: string[];
  faqCoverage: number;
  aiMentions: number;
  citedDomains: string[];
  notes: string;
}

export type TargetEngine = "ChatGPT" | "Gemini" | "Perplexity" | "Google AI Overviews" | "Copilot";
export type Sentiment = "Positive" | "Neutral" | "Negative";

export interface AIPrompt {
  id: string;
  projectId: string;
  text: string;
  intent: SearchIntent;
  persona: string;
  location: string;
  engine: TargetEngine;
  brandMentioned: boolean;
  competitorMentions: string[];
  mentionPosition: number | null;
  sentiment: Sentiment;
  citedDomains: string[];
  dateChecked: string;
  notes: string;
}

export interface AIVisibilityReview {
  id: string;
  projectId: string;
  prompt: string;
  engine: TargetEngine;
  rawResponse: string;
  brandMentions: string[];
  competitorMentions: string[];
  mentionOrder: string[];
  sentiment: Sentiment;
  citedWebsites: string[];
  missingInfo: string[];
  contentGaps: string[];
  authoritySources: string[];
  comparisonPages: string[];
  entityPages: string[];
  createdAt: string;
}

export interface Integration {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: "Connected" | "Not connected" | "Error";
  category: "Search" | "Analytics" | "Local" | "Keyword" | "Performance" | "Notification";
  lastSync?: string;
  serverSide: boolean;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  dateRange: string;
  executiveSummary: string;
  keyWins: string[];
  issuesFound: string[];
  actionPlan: string[];
  createdAt: string;
}
