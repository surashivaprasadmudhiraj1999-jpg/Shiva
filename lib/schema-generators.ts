// JSON-LD generators + validation for Schema Studio.

export interface SchemaField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface SchemaTemplate {
  type: string;
  label: string;
  fields: SchemaField[];
  build: (v: Record<string, string>) => object;
}

const f = (key: string, label: string, placeholder: string, required = false): SchemaField => ({
  key,
  label,
  placeholder,
  required,
});

export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    type: "FAQPage",
    label: "FAQPage",
    fields: [f("q1", "Question 1", "What areas do you cover?", true), f("a1", "Answer 1", "We cover all of Hyderabad…", true), f("q2", "Question 2", "Do you offer site visits?"), f("a2", "Answer 2", "Yes, free site visits…")],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        v.q1 && { "@type": "Question", name: v.q1, acceptedAnswer: { "@type": "Answer", text: v.a1 } },
        v.q2 && { "@type": "Question", name: v.q2, acceptedAnswer: { "@type": "Answer", text: v.a2 } },
      ].filter(Boolean),
    }),
  },
  {
    type: "Article",
    label: "Article",
    fields: [f("headline", "Headline", "Guide to buying property in Hyderabad", true), f("author", "Author", "Jane Doe", true), f("datePublished", "Date published", "2026-06-01", true), f("image", "Image URL", "https://…/cover.jpg")],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: v.headline,
      author: { "@type": "Person", name: v.author },
      datePublished: v.datePublished,
      image: v.image || undefined,
    }),
  },
  {
    type: "BlogPosting",
    label: "BlogPosting",
    fields: [f("headline", "Headline", "5 luxury projects near Financial District", true), f("author", "Author", "Jane Doe", true), f("datePublished", "Date published", "2026-06-01", true)],
    build: (v) => ({ "@context": "https://schema.org", "@type": "BlogPosting", headline: v.headline, author: { "@type": "Person", name: v.author }, datePublished: v.datePublished }),
  },
  {
    type: "LocalBusiness",
    label: "LocalBusiness",
    fields: [f("name", "Business name", "Skyline Realty", true), f("street", "Street", "Plot 12, Gachibowli", true), f("city", "City", "Hyderabad", true), f("phone", "Phone", "+91 90000 00000", true), f("url", "Website", "https://skylinerealty.in")],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: v.name,
      address: { "@type": "PostalAddress", streetAddress: v.street, addressLocality: v.city },
      telephone: v.phone,
      url: v.url || undefined,
    }),
  },
  {
    type: "Organization",
    label: "Organization",
    fields: [f("name", "Name", "Skyline Realty", true), f("url", "Website", "https://skylinerealty.in", true), f("logo", "Logo URL", "https://…/logo.png"), f("sameAs", "Social profile URL", "https://linkedin.com/company/…")],
    build: (v) => ({ "@context": "https://schema.org", "@type": "Organization", name: v.name, url: v.url, logo: v.logo || undefined, sameAs: v.sameAs ? [v.sameAs] : undefined }),
  },
  {
    type: "Product",
    label: "Product",
    fields: [f("name", "Product name", "3BHK Apartment — Skyline Towers", true), f("description", "Description", "Premium 3BHK with skyline views", true), f("price", "Price", "12500000"), f("currency", "Currency", "INR")],
    build: (v) => ({ "@context": "https://schema.org", "@type": "Product", name: v.name, description: v.description, offers: v.price ? { "@type": "Offer", price: v.price, priceCurrency: v.currency || "INR" } : undefined }),
  },
  {
    type: "Service",
    label: "Service",
    fields: [f("name", "Service name", "Property advisory", true), f("provider", "Provider", "Skyline Realty", true), f("areaServed", "Area served", "Hyderabad")],
    build: (v) => ({ "@context": "https://schema.org", "@type": "Service", name: v.name, provider: { "@type": "Organization", name: v.provider }, areaServed: v.areaServed || undefined }),
  },
  {
    type: "BreadcrumbList",
    label: "BreadcrumbList",
    fields: [f("n1", "Crumb 1", "Home", true), f("u1", "URL 1", "https://site.com", true), f("n2", "Crumb 2", "Projects", true), f("u2", "URL 2", "https://site.com/projects", true)],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: v.n1, item: v.u1 },
        { "@type": "ListItem", position: 2, name: v.n2, item: v.u2 },
      ],
    }),
  },
  {
    type: "Review",
    label: "Review",
    fields: [f("itemName", "Item reviewed", "Skyline Towers", true), f("rating", "Rating (1-5)", "5", true), f("author", "Reviewer", "A. Kumar", true), f("body", "Review body", "Excellent project…")],
    build: (v) => ({ "@context": "https://schema.org", "@type": "Review", itemReviewed: { "@type": "Thing", name: v.itemName }, reviewRating: { "@type": "Rating", ratingValue: v.rating, bestRating: "5" }, author: { "@type": "Person", name: v.author }, reviewBody: v.body || undefined }),
  },
  {
    type: "Event",
    label: "Event",
    fields: [f("name", "Event name", "Open house — Skyline Towers", true), f("startDate", "Start date", "2026-07-15T10:00", true), f("location", "Location", "Gachibowli, Hyderabad", true)],
    build: (v) => ({ "@context": "https://schema.org", "@type": "Event", name: v.name, startDate: v.startDate, location: { "@type": "Place", name: v.location } }),
  },
];

export function buildSchema(type: string, values: Record<string, string>): { json: string; warnings: string[]; valid: boolean } {
  const tpl = SCHEMA_TEMPLATES.find((t) => t.type === type);
  if (!tpl) return { json: "{}", warnings: ["Unknown schema type"], valid: false };
  const warnings = tpl.fields
    .filter((field) => field.required && !values[field.key]?.trim())
    .map((field) => `Missing required field: ${field.label}`);
  const obj = tpl.build(values);
  return { json: JSON.stringify(obj, null, 2), warnings, valid: warnings.length === 0 };
}
