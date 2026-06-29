"use client";

import * as React from "react";
import { Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared";
import { DataSourceBadge } from "@/components/data-source-badge";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import type { Competitor } from "@/lib/types";
import { uid, formatNumber } from "@/lib/utils";

// Content gap matrix demo
const GAP_MATRIX = [
  { cluster: "Apartments — Gachibowli", me: true, c1: true, c2: true, opp: "Low" },
  { cluster: "Apartments — Financial District", me: false, c1: true, c2: true, opp: "High" },
  { cluster: "Villas — Kokapet", me: false, c1: true, c2: false, opp: "High" },
  { cluster: "Builder comparisons", me: false, c1: true, c2: true, opp: "High" },
  { cluster: "Home loan guides", me: true, c1: false, c2: true, opp: "Medium" },
  { cluster: "Investment / ROI guides", me: false, c1: true, c2: true, opp: "High" },
  { cluster: "Ready-to-move listings", me: true, c1: true, c2: true, opp: "Low" },
  { cluster: "NRI buying guides", me: false, c1: false, c2: true, opp: "Medium" },
];

export default function CompetitorsPage() {
  const { dispatch, currentProjectId, role } = useStore();
  const { competitors } = useProjectData();
  const [open, setOpen] = React.useState(false);

  const maxVis = Math.max(...competitors.map((c) => c.organicVisibility), 100);

  return (
    <div>
      <PageHeader title="Competitor Workspace" description="Benchmark organic, content, schema and AI-answer presence against rivals.">
        <DataSourceBadge source="demo" />
        {canEdit(role) && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add competitor
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Competitor comparison</CardTitle>
          <CardDescription>Organic visibility, content footprint, schema usage and AI mentions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Competitor</TH>
                <TH>Organic visibility</TH>
                <TH>Ranking keywords</TH>
                <TH>Top pages</TH>
                <TH>FAQ coverage</TH>
                <TH>Schema usage</TH>
                <TH>AI mentions</TH>
                <TH>Cited domains</TH>
              </TR>
            </THead>
            <TBody>
              {competitors.map((c) => (
                <TR key={c.id}>
                  <TD className="font-medium">
                    {c.name}
                    <p className="font-mono text-xs font-normal text-muted-foreground">{c.domain}</p>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Progress value={(c.organicVisibility / maxVis) * 100} className="w-20" />
                      <span className="text-sm">{c.organicVisibility}</span>
                    </div>
                  </TD>
                  <TD>{formatNumber(c.rankingKeywords)}</TD>
                  <TD>{c.topPages}</TD>
                  <TD>{c.faqCoverage}%</TD>
                  <TD>
                    <div className="flex flex-wrap gap-1">
                      {c.schemaUsage.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TD>
                  <TD>{c.aiMentions}</TD>
                  <TD className="text-xs text-muted-foreground">{c.citedDomains.join(", ")}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Content Gap Matrix</CardTitle>
          <CardDescription>Topic / keyword cluster coverage — find where rivals rank and you don&apos;t</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Topic / Keyword cluster</TH>
                <TH>My brand</TH>
                <TH>Competitor 1</TH>
                <TH>Competitor 2</TH>
                <TH>Opportunity</TH>
              </TR>
            </THead>
            <TBody>
              {GAP_MATRIX.map((g) => (
                <TR key={g.cluster}>
                  <TD className="font-medium">{g.cluster}</TD>
                  <TD>{g.me ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-danger" />}</TD>
                  <TD>{g.c1 ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground" />}</TD>
                  <TD>{g.c2 ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground" />}</TD>
                  <TD>
                    <Badge variant={g.opp === "High" ? "danger" : g.opp === "Medium" ? "warning" : "secondary"}>{g.opp}</Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <AddCompetitorModal open={open} onClose={() => setOpen(false)} projectId={currentProjectId} onAdd={(c) => dispatch({ type: "ADD_COMPETITOR", competitor: c })} />
    </div>
  );
}

function AddCompetitorModal({ open, onClose, projectId, onAdd }: { open: boolean; onClose: () => void; projectId: string; onAdd: (c: Competitor) => void }) {
  const [f, setF] = React.useState({ name: "", domain: "", organicVisibility: "", rankingKeywords: "", notes: "" });
  const set = (k: keyof typeof f) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit() {
    if (!f.name) return;
    onAdd({
      id: uid("c"),
      projectId,
      name: f.name,
      domain: f.domain,
      organicVisibility: Number(f.organicVisibility) || 0,
      rankingKeywords: Number(f.rankingKeywords) || 0,
      topPages: 0,
      schemaUsage: [],
      faqCoverage: 0,
      aiMentions: 0,
      citedDomains: [],
      notes: f.notes,
    });
    onClose();
    setF({ name: "", domain: "", organicVisibility: "", rankingKeywords: "", notes: "" });
  }
  return (
    <Modal open={open} onClose={onClose} title="Add competitor" description="Track a rival's organic and AI-answer presence.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">Name *</Label>
          <Input value={f.name} onChange={set("name")} placeholder="My Home Constructions" />
        </div>
        <div>
          <Label className="mb-1 block">Domain</Label>
          <Input value={f.domain} onChange={set("domain")} placeholder="myhomeconstructions.com" />
        </div>
        <div>
          <Label className="mb-1 block">Organic visibility (0-100)</Label>
          <Input value={f.organicVisibility} onChange={set("organicVisibility")} type="number" placeholder="72" />
        </div>
        <div>
          <Label className="mb-1 block">Ranking keywords</Label>
          <Input value={f.rankingKeywords} onChange={set("rankingKeywords")} type="number" placeholder="5400" />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Notes</Label>
          <Textarea value={f.notes} onChange={set("notes")} placeholder="Strengths, weaknesses, observations…" />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!f.name}>
          Add competitor
        </Button>
      </div>
    </Modal>
  );
}
