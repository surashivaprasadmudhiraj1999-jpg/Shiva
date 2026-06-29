// ─────────────────────────────────────────────────────────────
// Transparent, rule-based scoring for SEO / AEO / GEO.
// All weights are explicit so scores are explainable in reports.
// ─────────────────────────────────────────────────────────────

export interface ScoreFactor {
  label: string;
  weight: number; // 0-1, sums to 1 within a model
  met: boolean;
  hint: string;
}

export interface ScoreResult {
  score: number; // 0-100
  factors: ScoreFactor[];
  band: "Strong" | "Needs work" | "At risk";
}

function compute(factors: ScoreFactor[]): ScoreResult {
  const totalWeight = factors.reduce((s, f) => s + f.weight, 0) || 1;
  const earned = factors.reduce((s, f) => s + (f.met ? f.weight : 0), 0);
  const score = Math.round((earned / totalWeight) * 100);
  return {
    score,
    factors,
    band: score >= 75 ? "Strong" : score >= 50 ? "Needs work" : "At risk",
  };
}

export interface AeoSignals {
  questionHeadings: boolean;
  directAnswerTop: boolean;
  conciseAnswerBlocks: boolean;
  faqCoverage: boolean;
  structuredData: boolean;
  citationQuality: boolean;
  entityClarity: boolean;
  readability: boolean;
  comparisonTables: boolean;
  freshContent: boolean;
}

export function scoreAeo(s: AeoSignals): ScoreResult {
  return compute([
    { label: "Clear question-led headings", weight: 0.12, met: s.questionHeadings, hint: "Use H2s phrased as the queries users ask." },
    { label: "Direct answer near the top", weight: 0.14, met: s.directAnswerTop, hint: "Add a 40–60 word answer under the H1." },
    { label: "Concise answer blocks", weight: 0.11, met: s.conciseAnswerBlocks, hint: "Lead each section with a snippet-length answer." },
    { label: "FAQ coverage", weight: 0.11, met: s.faqCoverage, hint: "Create an FAQ section targeting question keywords." },
    { label: "Structured data coverage", weight: 0.12, met: s.structuredData, hint: "Add FAQPage / Article schema." },
    { label: "Citation / source quality", weight: 0.1, met: s.citationQuality, hint: "Support claims with reliable sources." },
    { label: "Entity clarity", weight: 0.09, met: s.entityClarity, hint: "Name the brand, place and product entities clearly." },
    { label: "Readability", weight: 0.08, met: s.readability, hint: "Short sentences, plain language, scannable." },
    { label: "Helpful comparison tables", weight: 0.07, met: s.comparisonTables, hint: "Use a table for commercial-intent queries." },
    { label: "Content freshness", weight: 0.06, met: s.freshContent, hint: "Update the page within the last 6 months." },
  ]);
}

export interface GeoSignals {
  brandEntity: boolean;
  consistentNAP: boolean;
  strongAboutPage: boolean;
  serviceLocationPages: boolean;
  externalMentions: boolean;
  structuredData: boolean;
  comparisonContent: boolean;
  faqs: boolean;
  expertContent: boolean;
  freshContent: boolean;
  citationWorthy: boolean;
  thirdPartyValidation: boolean;
}

export function scoreGeo(s: GeoSignals): ScoreResult {
  return compute([
    { label: "Clear brand entity information", weight: 0.1, met: s.brandEntity, hint: "Define the brand with sameAs + Organization schema." },
    { label: "Consistent business information", weight: 0.08, met: s.consistentNAP, hint: "Keep name, address, phone consistent everywhere." },
    { label: "Strong About page", weight: 0.08, met: s.strongAboutPage, hint: "Detail history, team, credentials." },
    { label: "Service & location pages", weight: 0.09, met: s.serviceLocationPages, hint: "Dedicated pages per service and city." },
    { label: "Authoritative external mentions", weight: 0.1, met: s.externalMentions, hint: "Earn mentions on trusted third-party sites." },
    { label: "Structured data", weight: 0.08, met: s.structuredData, hint: "Organization, LocalBusiness, Product schema." },
    { label: "Comparison content", weight: 0.08, met: s.comparisonContent, hint: "Publish vs / alternatives pages." },
    { label: "FAQs", weight: 0.07, met: s.faqs, hint: "Answer common buyer questions on-page." },
    { label: "Expert content", weight: 0.08, met: s.expertContent, hint: "Author bios, first-hand expertise." },
    { label: "Fresh content", weight: 0.06, met: s.freshContent, hint: "Recently reviewed and dated." },
    { label: "Citation-worthy claims", weight: 0.05, met: s.citationWorthy, hint: "Original data, statistics, definitions." },
    { label: "Third-party validation signals", weight: 0.05, met: s.thirdPartyValidation, hint: "Reviews, ratings, press." },
  ]);
}

export interface OnPageSignals {
  titleTag: boolean;
  metaDescription: boolean;
  h1Relevance: boolean;
  keywordPlacement: boolean;
  semanticEntities: boolean;
  contentDepth: boolean;
  internalLinks: boolean;
  schema: boolean;
  readability: boolean;
  freshness: boolean;
}

export function scoreOnPage(s: OnPageSignals): ScoreResult {
  return compute([
    { label: "Title tag", weight: 0.13, met: s.titleTag, hint: "Front-load the primary keyword, keep under 60 chars." },
    { label: "Meta description", weight: 0.1, met: s.metaDescription, hint: "Compelling 150–160 char summary with CTA." },
    { label: "H1 relevance", weight: 0.1, met: s.h1Relevance, hint: "Single H1 matching search intent." },
    { label: "Keyword placement", weight: 0.11, met: s.keywordPlacement, hint: "Keyword in intro, a subhead and naturally in body." },
    { label: "Semantic entities", weight: 0.1, met: s.semanticEntities, hint: "Cover related entities and subtopics." },
    { label: "Content depth", weight: 0.11, met: s.contentDepth, hint: "Match or exceed the depth of top results." },
    { label: "Internal-link opportunities", weight: 0.1, met: s.internalLinks, hint: "Link to and from relevant cluster pages." },
    { label: "Schema opportunities", weight: 0.09, met: s.schema, hint: "Add the most relevant structured data type." },
    { label: "Readability", weight: 0.08, met: s.readability, hint: "Clear structure, short paragraphs." },
    { label: "Content freshness", weight: 0.08, met: s.freshness, hint: "Refresh stale facts and dates." },
  ]);
}

/** Featured-snippet suitability heuristic for the AEO opportunity finder. */
export function snippetSuitability(intent: string, hasQuestion: boolean, volume: number): "High" | "Medium" | "Low" {
  if (intent === "Informational" && hasQuestion && volume > 300) return "High";
  if (hasQuestion || intent === "Informational") return "Medium";
  return "Low";
}
