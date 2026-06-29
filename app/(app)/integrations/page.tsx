"use client";

import * as React from "react";
import { ShieldCheck, Plug, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatusBadge, Disclaimer } from "@/components/shared";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

export default function IntegrationsPage() {
  const { dispatch, role } = useStore();
  const { integrations } = useProjectData();

  function toggle(id: string, status: string) {
    const next = status === "Connected" ? "Not connected" : "Connected";
    dispatch({ type: "UPDATE_INTEGRATION", id, patch: { status: next, lastSync: next === "Connected" ? new Date().toISOString() : undefined } });
  }

  const byCategory = integrations.reduce<Record<string, typeof integrations>>((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Integrations" description="Connect live data sources. Until connected, the app uses clearly labelled demo data." />

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-semibold">Keys never touch the browser</p>
              <p className="text-sm text-muted-foreground">
                All credentials are stored as server-side environment variables and used only in API routes. The frontend never sees an
                API key or secret.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Lock className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">How connecting works</p>
              <p className="text-sm text-muted-foreground">
                Each integration uses server-side OAuth or a secret in <code className="rounded bg-secondary px-1">.env.local</code>. See{" "}
                <code className="rounded bg-secondary px-1">.env.example</code> for the full list.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Disclaimer>
        This demo toggles status locally to illustrate the flow. In production, &quot;Connect&quot; starts a server-side OAuth handshake — no
        secrets are entered or stored in the UI.
      </Disclaimer>

      <div className="mt-5 space-y-6">
        {Object.entries(byCategory).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((i) => (
                <Card key={i.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                          <Plug className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold leading-tight">{i.name}</p>
                          <Badge variant="secondary" className="mt-0.5">
                            {i.serverSide ? "Server-side" : "Client"}
                          </Badge>
                        </div>
                      </div>
                      <StatusBadge status={i.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{i.description}</p>
                    {i.lastSync && <p className="mt-2 text-xs text-muted-foreground">Last sync {relativeTime(i.lastSync)}</p>}
                    {canEdit(role) && (
                      <Button
                        className="mt-4 w-full"
                        size="sm"
                        variant={i.status === "Connected" ? "outline" : "default"}
                        onClick={() => toggle(i.id, i.status)}
                      >
                        {i.status === "Connected" ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
