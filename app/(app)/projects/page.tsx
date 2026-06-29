"use client";

import * as React from "react";
import { Plus, Globe, MapPin, Target, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/shared";
import { useStore, canEdit } from "@/lib/store";
import type { Project, SearchGoal } from "@/lib/types";
import { uid } from "@/lib/utils";

const GOALS: SearchGoal[] = ["Traffic", "Leads", "Brand visibility", "Local SEO", "AI visibility", "Content growth"];
const INDUSTRIES = ["Real Estate", "B2B SaaS", "E-commerce", "Healthcare", "Finance", "Legal", "Hospitality", "Education", "Other"];

export default function ProjectsPage() {
  const { projects, currentProjectId, dispatch, role } = useStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <PageHeader title="Projects" description="Manage all client websites in one account. Switch the active project from the top bar.">
        {canEdit(role) && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className={p.id === currentProjectId ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{p.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" /> {p.domain}
                  </p>
                </div>
                {p.isSample && <Badge variant="warning">Sample Data</Badge>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {p.industry}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {p.targetCity}, {p.targetCountry}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.goals.map((g) => (
                  <Badge key={g} variant="secondary">
                    <Target className="h-3 w-3" />
                    {g}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  size="sm"
                  variant={p.id === currentProjectId ? "secondary" : "default"}
                  onClick={() => dispatch({ type: "SET_PROJECT", id: p.id })}
                  disabled={p.id === currentProjectId}
                >
                  {p.id === currentProjectId ? "Active project" : "Open project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewProjectModal open={open} onClose={() => setOpen(false)} onCreate={(proj) => dispatch({ type: "ADD_PROJECT", project: proj })} />
    </div>
  );
}

function NewProjectModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (p: Project) => void }) {
  const [form, setForm] = React.useState({
    name: "",
    domain: "",
    industry: "Real Estate",
    targetCountry: "India",
    targetCity: "",
    language: "English",
    audience: "",
    competitors: "",
    brandName: "",
    productsServices: "",
  });
  const [goals, setGoals] = React.useState<SearchGoal[]>(["Traffic", "Leads"]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleGoal = (g: SearchGoal) => setGoals((arr) => (arr.includes(g) ? arr.filter((x) => x !== g) : [...arr, g]));

  function submit() {
    if (!form.name || !form.domain) return;
    onCreate({
      id: uid("proj"),
      name: form.name,
      domain: form.domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      industry: form.industry,
      targetCountry: form.targetCountry,
      targetCity: form.targetCity,
      language: form.language,
      audience: form.audience,
      competitors: form.competitors.split(",").map((s) => s.trim()).filter(Boolean),
      brandName: form.brandName || form.name,
      productsServices: form.productsServices,
      goals,
      isSample: false,
      createdAt: new Date().toISOString(),
    });
    onClose();
    setForm({ ...form, name: "", domain: "", targetCity: "", audience: "", competitors: "", brandName: "", productsServices: "" });
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a project" description="Set up a new client website and target market." className="max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name *">
          <Input value={form.name} onChange={set("name")} placeholder="Skyline Realty — Hyderabad" />
        </Field>
        <Field label="Website domain *">
          <Input value={form.domain} onChange={set("domain")} placeholder="skylinerealty.in" />
        </Field>
        <Field label="Industry">
          <Select value={form.industry} onChange={set("industry")}>
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
        </Field>
        <Field label="Brand name">
          <Input value={form.brandName} onChange={set("brandName")} placeholder="Skyline Realty" />
        </Field>
        <Field label="Target country">
          <Input value={form.targetCountry} onChange={set("targetCountry")} placeholder="India" />
        </Field>
        <Field label="Target city / location">
          <Input value={form.targetCity} onChange={set("targetCity")} placeholder="Hyderabad" />
        </Field>
        <Field label="Main language">
          <Input value={form.language} onChange={set("language")} placeholder="English" />
        </Field>
        <Field label="Primary competitors (comma-separated)">
          <Input value={form.competitors} onChange={set("competitors")} placeholder="competitor1.com, competitor2.com" />
        </Field>
        <Field label="Target audience" className="sm:col-span-2">
          <Textarea value={form.audience} onChange={set("audience")} placeholder="Who are you trying to reach?" className="min-h-[60px]" />
        </Field>
        <Field label="Main products or services" className="sm:col-span-2">
          <Textarea value={form.productsServices} onChange={set("productsServices")} placeholder="What do you sell?" className="min-h-[60px]" />
        </Field>
        <Field label="Search goals" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  goals.includes(g) ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-accent"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!form.name || !form.domain}>
          Create project
        </Button>
      </div>
    </Modal>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
