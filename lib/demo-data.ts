import type {
  Organization,
  Project,
  Task,
  Insight,
  AuditCheck,
  Keyword,
  ContentBrief,
  SchemaDraft,
  Competitor,
  AIPrompt,
  AIVisibilityReview,
  Integration,
  Report,
  User,
} from "./types";

const days = (n: number) => {
  const d = new Date("2026-06-29T09:00:00Z");
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const demoUsers: User[] = [
  { id: "u_owner", name: "Shiva Prasad", email: "surashivaprasadmudhiraj1999@gmail.com", role: "Owner", avatarColor: "#2563eb" },
  { id: "u_editor", name: "Priya Nair", email: "priya@agency.com", role: "Editor", avatarColor: "#16a34a" },
  { id: "u_viewer", name: "Client — Skyline", email: "client@skylinerealty.in", role: "Viewer", avatarColor: "#d97706" },
];

export const demoOrg: Organization = {
  id: "org_1",
  name: "Northstar Digital Agency",
  plan: "Agency",
  members: demoUsers,
};

export const SAMPLE_PROJECT_ID = "proj_sample_realestate";

export const demoProjects: Project[] = [
  {
    id: SAMPLE_PROJECT_ID,
    name: "Skyline Realty — Hyderabad",
    domain: "skylinerealty.in",
    industry: "Real Estate",
    targetCountry: "India",
    targetCity: "Hyderabad",
    language: "English",
    audience: "NRIs and professionals buying premium apartments in West Hyderabad",
    competitors: ["mygate.com", "prestigegroup.com", "myhomeconstructions.com"],
    brandName: "Skyline Realty",
    productsServices: "Premium 2–4 BHK apartments, villas, property advisory, and rental management",
    goals: ["Traffic", "Leads", "Local SEO", "AI visibility"],
    isSample: true,
    createdAt: days(-120),
  },
  {
    id: "proj_saas",
    name: "FlowMetric SaaS",
    domain: "flowmetric.io",
    industry: "B2B SaaS — Analytics",
    targetCountry: "United States",
    targetCity: "Remote",
    language: "English",
    audience: "Product and growth teams at mid-market companies",
    competitors: ["mixpanel.com", "amplitude.com"],
    brandName: "FlowMetric",
    productsServices: "Product analytics, funnels, session insights",
    goals: ["Traffic", "Brand visibility", "Content growth", "AI visibility"],
    isSample: false,
    createdAt: days(-60),
  },
];

export const demoTasks: Task[] = [
  { id: "t1", projectId: SAMPLE_PROJECT_ID, title: "Fix 4 service pages with declining impressions", category: "SEO", priority: "High", impact: "+12% impressions est.", assignee: "Priya Nair", status: "In progress", dueDate: days(4), source: "demo", createdAt: days(-6) },
  { id: "t2", projectId: SAMPLE_PROJECT_ID, title: "Add FAQ schema to high-intent project pages", category: "AEO", priority: "High", impact: "Snippet eligibility for 9 queries", assignee: "Priya Nair", status: "To do", dueDate: days(2), source: "demo", createdAt: days(-3) },
  { id: "t3", projectId: SAMPLE_PROJECT_ID, title: "Improve title tags on 6 low-CTR pages", category: "SEO", priority: "Medium", impact: "+0.8% CTR est.", assignee: "Shiva Prasad", status: "To do", dueDate: days(7), source: "demo", createdAt: days(-2) },
  { id: "t4", projectId: SAMPLE_PROJECT_ID, title: "Refresh 'best areas to invest' guide losing rankings", category: "Content", priority: "Medium", impact: "Recover positions 4→2", assignee: "Priya Nair", status: "To do", dueDate: days(10), source: "demo", createdAt: days(-1) },
  { id: "t5", projectId: SAMPLE_PROJECT_ID, title: "Add internal links to 5 orphan project pages", category: "Technical", priority: "Medium", impact: "Improve crawl + equity flow", assignee: "Shiva Prasad", status: "Blocked", dueDate: days(5), source: "demo", createdAt: days(-4) },
  { id: "t6", projectId: SAMPLE_PROJECT_ID, title: "Improve answer blocks for 'home loan eligibility' snippet", category: "AEO", priority: "Low", impact: "Snippet capture opportunity", assignee: "Priya Nair", status: "Done", dueDate: days(-2), source: "demo", createdAt: days(-12) },
  { id: "t7", projectId: SAMPLE_PROJECT_ID, title: "Review competitor mentions in comparison AI answers", category: "GEO", priority: "High", impact: "Close brand visibility gap", assignee: "Shiva Prasad", status: "In progress", dueDate: days(3), source: "demo", createdAt: days(-5) },
];

export const demoInsights: Insight[] = [
  { id: "i1", projectId: SAMPLE_PROJECT_ID, text: "Your Gachibowli service page is receiving impressions but has a low CTR (1.1%). Improve the title and meta description.", source: "Search Console (Demo)", updatedAt: days(-1), category: "SEO" },
  { id: "i2", projectId: SAMPLE_PROJECT_ID, text: "Three pages rank for question-based keywords but are missing FAQ schema.", source: "Technical audit (Last crawl)", updatedAt: days(-2), category: "AEO" },
  { id: "i3", projectId: SAMPLE_PROJECT_ID, text: "Competitor My Home appears more frequently in comparison-style AI answers for 'best apartments in Hyderabad'.", source: "AI Visibility Review (Manual)", updatedAt: days(-3), category: "GEO" },
  { id: "i4", projectId: SAMPLE_PROJECT_ID, text: "Two high-volume keywords show cannibalisation between the blog and a project page.", source: "Keyword analysis (Demo)", updatedAt: days(-2), category: "SEO" },
];

const audit = (url: string, metric: string, value: string, status: AuditCheck["status"]): AuditCheck => ({
  id: `a_${Math.random().toString(36).slice(2, 8)}`,
  url,
  metric,
  value,
  status,
  source: "crawl",
});

export const demoAudit: AuditCheck[] = [
  audit("/", "HTTP status code", "200 OK", "Passed"),
  audit("/", "Indexability", "Indexable", "Passed"),
  audit("/", "Title tag", "Present (58 chars)", "Passed"),
  audit("/", "Meta description", "Present (142 chars)", "Passed"),
  audit("/", "H1 count", "1", "Passed"),
  audit("/", "Core Web Vitals", "Placeholder — connect PageSpeed", "Not checked"),
  audit("/projects/gachibowli", "Title tag", "Duplicate of /projects/kondapur", "Critical"),
  audit("/projects/gachibowli", "Meta description", "Missing", "Warning"),
  audit("/projects/gachibowli", "Image alt text", "7 of 18 images missing alt", "Warning"),
  audit("/projects/gachibowli", "Schema markup", "None detected", "Warning"),
  audit("/projects/gachibowli", "Canonical tag", "Missing", "Critical"),
  audit("/blog/best-areas-invest", "Broken internal links", "2 broken links", "Critical"),
  audit("/blog/best-areas-invest", "Redirect chains", "1 chain (3 hops)", "Warning"),
  audit("/blog/best-areas-invest", "Content freshness", "Updated 14 months ago", "Warning"),
  audit("/contact", "Robots meta tags", "index, follow", "Passed"),
  audit("/contact", "Page depth", "2 clicks from home", "Passed"),
  audit("/villas/kokapet", "Indexability", "noindex detected", "Critical"),
  audit("/villas/kokapet", "Internal links count", "0 (orphan page)", "Critical"),
  audit("sitewide", "Sitemap presence", "/sitemap.xml found", "Passed"),
  audit("sitewide", "Robots.txt presence", "/robots.txt found", "Passed"),
  audit("sitewide", "Duplicate title tags", "3 sets found", "Warning"),
  audit("sitewide", "Duplicate meta descriptions", "5 pages", "Warning"),
  audit("sitewide", "Broken external links", "1 found", "Warning"),
];

const kw = (
  keyword: string,
  volume: number,
  difficulty: number,
  position: number | null,
  targetUrl: string,
  intent: Keyword["intent"],
  priority: Keyword["priority"],
  cluster: string,
  funnelStage: Keyword["funnelStage"],
  location: string,
  contentStatus: Keyword["contentStatus"],
  competitorRanking: string,
  tags: string[] = [],
): Keyword => ({
  id: `k_${Math.random().toString(36).slice(2, 8)}`,
  projectId: SAMPLE_PROJECT_ID,
  keyword,
  volume,
  difficulty,
  position,
  targetUrl,
  intent,
  priority,
  contentStatus,
  cluster,
  funnelStage,
  location,
  tags,
  competitorRanking,
  source: "demo",
});

export const demoKeywords: Keyword[] = [
  kw("luxury apartments in hyderabad", 4400, 62, 6, "/projects", "Commercial", "High", "Apartments", "MOFU", "Hyderabad", "Draft", "myhomeconstructions.com", ["service"]),
  kw("3bhk flats in gachibowli", 2900, 48, 4, "/projects/gachibowli", "Transactional", "High", "Apartments", "BOFU", "Gachibowli", "Published", "prestigegroup.com", ["location"]),
  kw("best areas to invest in hyderabad", 3600, 55, 8, "/blog/best-areas-invest", "Informational", "Medium", "Investment", "TOFU", "Hyderabad", "Review", "99acres.com", ["blog"]),
  kw("flats near financial district", 1900, 44, 5, "/projects/financial-district", "Commercial", "High", "Apartments", "MOFU", "Financial District", "Planned", "myhomeconstructions.com", ["location"]),
  kw("apartments in hyderabad", 6600, 70, 11, "/projects", "Commercial", "Medium", "Apartments", "MOFU", "Hyderabad", "Published", "magicbricks.com", ["head"]),
  kw("home loan eligibility for apartments", 1200, 38, 3, "/guides/home-loan-eligibility", "Informational", "Low", "Finance", "TOFU", "India", "Published", "hdfc.com", ["blog"]),
  kw("villas in kokapet", 1600, 50, null, "/villas/kokapet", "Transactional", "Medium", "Villas", "BOFU", "Kokapet", "Planned", "prestigegroup.com", ["location"]),
  kw("skyline realty reviews", 320, 20, 2, "/about", "Navigational", "Medium", "Brand", "BOFU", "Hyderabad", "Published", "—", ["brand"]),
  kw("ready to move flats in kondapur", 880, 41, 7, "/projects/kondapur", "Transactional", "Medium", "Apartments", "BOFU", "Kondapur", "Draft", "myhomeconstructions.com", ["location"]),
  kw("property advisory services hyderabad", 590, 35, 9, "/services/advisory", "Commercial", "Low", "Services", "MOFU", "Hyderabad", "Planned", "—", ["service"]),
];

export const demoBriefs: ContentBrief[] = [
  {
    id: "b1",
    projectId: SAMPLE_PROJECT_ID,
    type: "Location page",
    primaryKeyword: "flats near financial district",
    secondaryKeywords: ["apartments financial district hyderabad", "2bhk near financial district", "gated community financial district"],
    intent: "Commercial",
    audience: "IT professionals relocating to West Hyderabad",
    funnelStage: "MOFU",
    suggestedTitle: "Premium Flats Near Financial District, Hyderabad | Skyline Realty",
    metaTitle: "Flats Near Financial District, Hyderabad — Skyline Realty",
    metaDescription: "Explore premium 2–4 BHK flats minutes from Hyderabad's Financial District. Book a free site visit with Skyline Realty.",
    slug: "/projects/financial-district",
    h1: "Premium Flats Near the Financial District, Hyderabad",
    outline: [
      { heading: "Why buy near the Financial District?", level: 2 },
      { heading: "Available projects & floor plans", level: 2 },
      { heading: "Connectivity & commute times", level: 3 },
      { heading: "Pricing and payment plans", level: 2 },
      { heading: "Frequently asked questions", level: 2 },
    ],
    directAnswer: "Flats near Hyderabad's Financial District typically range from ₹95L for a 2BHK to ₹2.4Cr for a 4BHK, with most gated communities within a 10–15 minute commute of the main IT campuses.",
    faqs: [
      { q: "What is the average price of a flat near the Financial District?", a: "Prices range from about ₹95L for a 2BHK to ₹2.4Cr for a premium 4BHK." },
      { q: "How far is the Financial District from the airport?", a: "Roughly 30–35 minutes via the Outer Ring Road." },
    ],
    internalLinks: ["/projects/gachibowli", "/guides/home-loan-eligibility", "/services/advisory"],
    externalSources: ["RERA Telangana listings", "HMDA master plan"],
    schema: "FAQPage + Product",
    competitorGaps: ["No competitor shows live commute times", "Missing payment-plan comparison table"],
    cta: "Book a free site visit",
    status: "Draft",
    writer: "Priya Nair",
    deadline: days(6),
    checklist: { "SEO complete": true, "AEO complete": false, "GEO ready": false, "Meta data complete": true, "Internal links added": true, "Schema prepared": false, "Sources added": true, Proofread: false, "Ready to publish": false },
  },
  {
    id: "b2",
    projectId: SAMPLE_PROJECT_ID,
    type: "Comparison page",
    primaryKeyword: "skyline realty vs my home constructions",
    secondaryKeywords: ["best builder in hyderabad", "skyline vs prestige"],
    intent: "Commercial",
    audience: "Buyers comparing premium builders",
    funnelStage: "BOFU",
    suggestedTitle: "Skyline Realty vs My Home: Which Builder Is Right for You?",
    metaTitle: "Skyline Realty vs My Home Constructions — Honest Comparison",
    metaDescription: "Compare Skyline Realty and My Home Constructions on pricing, locations, possession timelines and amenities.",
    slug: "/compare/skyline-vs-myhome",
    h1: "Skyline Realty vs My Home Constructions",
    outline: [
      { heading: "Quick verdict", level: 2 },
      { heading: "Pricing comparison", level: 2 },
      { heading: "Locations & projects", level: 2 },
      { heading: "Amenities & possession timelines", level: 3 },
      { heading: "FAQs", level: 2 },
    ],
    directAnswer: "Skyline Realty focuses on boutique premium projects in West Hyderabad with faster possession, while My Home offers larger townships at a wider price range — your choice depends on community size and budget.",
    faqs: [{ q: "Which builder has faster possession?", a: "Skyline Realty averages 6 months faster possession on comparable projects." }],
    internalLinks: ["/projects", "/about"],
    externalSources: ["RERA possession data"],
    schema: "FAQPage + Review",
    competitorGaps: ["No neutral comparison content exists for this query"],
    cta: "Talk to an advisor",
    status: "Planned",
    writer: "Unassigned",
    deadline: days(14),
    checklist: { "SEO complete": false, "AEO complete": false, "GEO ready": false, "Meta data complete": false, "Internal links added": false, "Schema prepared": false, "Sources added": false, Proofread: false, "Ready to publish": false },
  },
];

export const demoSchemas: SchemaDraft[] = [
  {
    id: "s1",
    projectId: SAMPLE_PROJECT_ID,
    name: "Homepage Organization",
    type: "Organization",
    json: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Skyline Realty", url: "https://skylinerealty.in", logo: "https://skylinerealty.in/logo.png", sameAs: ["https://www.linkedin.com/company/skyline-realty"] }, null, 2),
    valid: true,
    warnings: [],
    updatedAt: days(-5),
  },
  {
    id: "s2",
    projectId: SAMPLE_PROJECT_ID,
    name: "Gachibowli project FAQ",
    type: "FAQPage",
    json: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What is the price of 3BHK in Gachibowli?", acceptedAnswer: { "@type": "Answer", text: "From ₹1.4Cr." } }] }, null, 2),
    valid: false,
    warnings: ["Add at least 2 questions for richer coverage"],
    updatedAt: days(-2),
  },
];

export const demoCompetitors: Competitor[] = [
  { id: "c1", projectId: SAMPLE_PROJECT_ID, name: "My Home Constructions", domain: "myhomeconstructions.com", organicVisibility: 72, rankingKeywords: 5400, topPages: 320, schemaUsage: ["Organization", "Product", "FAQPage"], faqCoverage: 68, aiMentions: 14, citedDomains: ["99acres.com", "magicbricks.com"], notes: "Dominates township queries; strong FAQ coverage." },
  { id: "c2", projectId: SAMPLE_PROJECT_ID, name: "Prestige Group", domain: "prestigegroup.com", organicVisibility: 81, rankingKeywords: 9100, topPages: 540, schemaUsage: ["Organization", "Product", "Breadcrumb", "Review"], faqCoverage: 74, aiMentions: 19, citedDomains: ["economictimes.com", "99acres.com"], notes: "National brand authority; frequent AI citations." },
  { id: "c3", projectId: SAMPLE_PROJECT_ID, name: "Skyline Realty (You)", domain: "skylinerealty.in", organicVisibility: 41, rankingKeywords: 1280, topPages: 96, schemaUsage: ["Organization"], faqCoverage: 22, aiMentions: 4, citedDomains: ["justdial.com"], notes: "Your brand — strong local relevance, thin entity signals." },
];

export const demoPrompts: AIPrompt[] = [
  { id: "p1", projectId: SAMPLE_PROJECT_ID, text: "Best real estate projects in Hyderabad", intent: "Commercial", persona: "First-time buyer", location: "Hyderabad", engine: "ChatGPT", brandMentioned: false, competitorMentions: ["My Home", "Prestige Group"], mentionPosition: null, sentiment: "Neutral", citedDomains: ["99acres.com", "magicbricks.com"], dateChecked: days(-3), notes: "Brand absent; competitors lead the list." },
  { id: "p2", projectId: SAMPLE_PROJECT_ID, text: "Top luxury apartments near Financial District", intent: "Commercial", persona: "NRI investor", location: "Financial District", engine: "Perplexity", brandMentioned: true, competitorMentions: ["My Home"], mentionPosition: 4, sentiment: "Positive", citedDomains: ["skylinerealty.in", "99acres.com"], dateChecked: days(-2), notes: "Mentioned 4th; our project page was cited." },
  { id: "p3", projectId: SAMPLE_PROJECT_ID, text: "Compare Skyline Realty vs My Home Constructions", intent: "Commercial", persona: "Comparison shopper", location: "Hyderabad", engine: "Gemini", brandMentioned: true, competitorMentions: ["My Home"], mentionPosition: 2, sentiment: "Neutral", citedDomains: ["justdial.com"], dateChecked: days(-1), notes: "No neutral comparison page exists — opportunity." },
  { id: "p4", projectId: SAMPLE_PROJECT_ID, text: "Which builder is best for ready-to-move flats in Kondapur?", intent: "Commercial", persona: "Urgent buyer", location: "Kondapur", engine: "Google AI Overviews", brandMentioned: false, competitorMentions: ["My Home", "Prestige Group"], mentionPosition: null, sentiment: "Neutral", citedDomains: ["magicbricks.com"], dateChecked: days(-4), notes: "Not surfaced; need ready-to-move entity content." },
];

export const demoReviews: AIVisibilityReview[] = [
  {
    id: "r1",
    projectId: SAMPLE_PROJECT_ID,
    prompt: "Best luxury apartments near Financial District Hyderabad",
    engine: "Perplexity",
    rawResponse:
      "For luxury apartments near Hyderabad's Financial District, popular options include My Home Avatar, Prestige High Fields, and Skyline Towers by Skyline Realty. My Home and Prestige are frequently cited for amenities, while Skyline Towers is noted for faster possession. Sources: 99acres.com, skylinerealty.in.",
    brandMentions: ["Skyline Towers", "Skyline Realty"],
    competitorMentions: ["My Home Avatar", "Prestige High Fields"],
    mentionOrder: ["My Home Avatar", "Prestige High Fields", "Skyline Towers"],
    sentiment: "Positive",
    citedWebsites: ["99acres.com", "skylinerealty.in"],
    missingInfo: ["Pricing not surfaced for Skyline", "No possession timeline cited"],
    contentGaps: ["Add a pricing table to the project page", "Publish possession-timeline content"],
    authoritySources: ["Get listed/quoted on 99acres editorial", "Pursue a Times Property mention"],
    comparisonPages: ["Skyline vs My Home", "Skyline vs Prestige"],
    entityPages: ["About Skyline Realty (entity)", "Skyline Towers project entity page"],
    createdAt: days(-2),
  },
];

export const demoIntegrations: Integration[] = [
  { id: "int1", projectId: SAMPLE_PROJECT_ID, name: "Google Search Console", description: "Clicks, impressions, positions, indexing.", status: "Not connected", category: "Search", serverSide: true },
  { id: "int2", projectId: SAMPLE_PROJECT_ID, name: "Google Analytics 4", description: "Sessions, conversions, engagement.", status: "Not connected", category: "Analytics", serverSide: true },
  { id: "int3", projectId: SAMPLE_PROJECT_ID, name: "Google Business Profile", description: "Local visibility, reviews, calls.", status: "Not connected", category: "Local", serverSide: true },
  { id: "int4", projectId: SAMPLE_PROJECT_ID, name: "DataForSEO", description: "Keyword volume, difficulty, SERPs.", status: "Not connected", category: "Keyword", serverSide: true },
  { id: "int5", projectId: SAMPLE_PROJECT_ID, name: "PageSpeed Insights", description: "Core Web Vitals & performance.", status: "Not connected", category: "Performance", serverSide: true },
  { id: "int6", projectId: SAMPLE_PROJECT_ID, name: "Slack", description: "Task and report notifications.", status: "Not connected", category: "Notification", serverSide: true },
  { id: "int7", projectId: SAMPLE_PROJECT_ID, name: "Email notifications", description: "Scheduled reports & alerts.", status: "Not connected", category: "Notification", serverSide: true },
];

export const demoReports: Report[] = [
  {
    id: "rep1",
    projectId: SAMPLE_PROJECT_ID,
    title: "Skyline Realty — Monthly SEO/AEO/GEO Report",
    dateRange: "1–30 Jun 2026",
    executiveSummary: "Organic impressions grew 18% MoM driven by Gachibowli and Kondapur project pages. AEO readiness improved as FAQ blocks rolled out, while GEO readiness remains the biggest opportunity — the brand is still under-cited in comparison-style AI answers.",
    keyWins: ["+18% organic impressions", "Captured 'home loan eligibility' featured snippet", "AEO score up from 48 → 61"],
    issuesFound: ["2 critical canonical issues on project pages", "Brand absent from 'best projects in Hyderabad' AI answers", "1 orphan villa page (noindex)"],
    actionPlan: ["Ship FAQ schema to 9 project pages", "Publish Skyline vs My Home comparison page", "Fix canonicals + internal links on orphan pages", "Pursue 2 third-party authority mentions"],
    createdAt: days(-1),
  },
];

// Dashboard time-series (demo)
export const demoTrends = {
  clicks: [820, 910, 870, 1040, 1180, 1120, 1320, 1410, 1380, 1520, 1610, 1740],
  impressions: [42000, 45000, 47000, 51000, 53000, 52000, 58000, 61000, 60000, 65000, 69000, 73000],
  months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  aeoProgression: [38, 41, 44, 46, 48, 52, 55, 58, 60, 59, 61, 64],
  geoProgression: [20, 22, 25, 27, 29, 31, 34, 36, 38, 40, 42, 45],
  keywordMovement: [
    { label: "Up", value: 34, color: "hsl(var(--success))" },
    { label: "Flat", value: 58, color: "hsl(var(--muted-foreground))" },
    { label: "Down", value: 12, color: "hsl(var(--danger))" },
  ],
};

export function demoKpis(_projectId: string) {
  return {
    organicClicks: { value: 1740, delta: 8.1 },
    organicImpressions: { value: 73000, delta: 6.4 },
    avgPosition: { value: 14.2, delta: -1.3 },
    organicCtr: { value: 2.38, delta: 0.2 },
    indexedPages: { value: 96, delta: 2 },
    technicalIssues: { value: 23, delta: -4 },
    contentOpportunities: { value: 18, delta: 3 },
    aeoScore: { value: 64, delta: 3 },
    geoScore: { value: 45, delta: 3 },
    brandMentionsAI: { value: 4, delta: 1 },
  };
}
