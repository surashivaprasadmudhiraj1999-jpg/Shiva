"use client";

import * as React from "react";
import { Shield, Users, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { PageHeader } from "@/components/shared";
import { useStore } from "@/lib/store";

const ROLE_MATRIX = [
  { capability: "View dashboards & reports", Owner: true, Editor: true, Viewer: true },
  { capability: "Edit projects & domains", Owner: true, Editor: true, Viewer: false },
  { capability: "Manage keywords & content", Owner: true, Editor: true, Viewer: false },
  { capability: "Create & update tasks", Owner: true, Editor: true, Viewer: false },
  { capability: "Connect integrations", Owner: true, Editor: true, Viewer: false },
  { capability: "Manage team & billing", Owner: true, Editor: false, Viewer: false },
];

export default function SettingsPage() {
  const { org, users, currentUser, currentProject, role } = useStore();

  return (
    <div>
      <PageHeader title="Settings" description="Workspace, team, roles and project configuration." />
      <Tabs defaultValue="org">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="team">Team & Roles</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Organization
              </CardTitle>
              <CardDescription>One account can manage multiple client projects.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-3">
              <div>
                <Label className="mb-1 block">Organization name</Label>
                <Input defaultValue={org.name} disabled={role !== "Owner"} />
              </div>
              <div>
                <Label className="mb-1 block">Plan</Label>
                <div>
                  <Badge variant="info">{org.plan}</Badge>
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Members</Label>
                <p className="text-sm text-muted-foreground">{users.length} members across all projects</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Team members
                </CardTitle>
                <CardDescription>Switch the active role from the user menu in the top bar (demo).</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <TR>
                      <TH>Member</TH>
                      <TH>Email</TH>
                      <TH>Role</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {users.map((u) => (
                      <TR key={u.id}>
                        <TD className="font-medium">
                          <span className="inline-flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: u.avatarColor }}>
                              {u.name.slice(0, 1)}
                            </span>
                            {u.name}
                            {u.id === currentUser.id && <Badge variant="secondary">You</Badge>}
                          </span>
                        </TD>
                        <TD className="text-sm text-muted-foreground">{u.email}</TD>
                        <TD>
                          <Badge variant="info">{u.role}</Badge>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Role-based access
                </CardTitle>
                <CardDescription>Owner — full access · Editor — edit projects, content & tasks · Viewer — view dashboards & reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <TR>
                      <TH>Capability</TH>
                      <TH>Owner</TH>
                      <TH>Editor</TH>
                      <TH>Viewer</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {ROLE_MATRIX.map((r) => (
                      <TR key={r.capability}>
                        <TD className="text-sm">{r.capability}</TD>
                        {(["Owner", "Editor", "Viewer"] as const).map((role) => (
                          <TD key={role}>{r[role] ? <span className="text-success">✓</span> : <span className="text-muted-foreground">—</span>}</TD>
                        ))}
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="project">
          <Card>
            <CardHeader>
              <CardTitle>{currentProject.name}</CardTitle>
              <CardDescription>{currentProject.domain}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Info label="Industry" value={currentProject.industry} />
              <Info label="Brand name" value={currentProject.brandName} />
              <Info label="Target country" value={currentProject.targetCountry} />
              <Info label="Target city" value={currentProject.targetCity} />
              <Info label="Language" value={currentProject.language} />
              <Info label="Competitors" value={currentProject.competitors.join(", ")} />
              <Info label="Audience" value={currentProject.audience} className="sm:col-span-2" />
              <Info label="Products / services" value={currentProject.productsServices} className="sm:col-span-2" />
              <Info label="Search goals" value={currentProject.goals.join(", ")} className="sm:col-span-2" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your profile in this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-3">
              <div>
                <Label className="mb-1 block">Name</Label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div>
                <Label className="mb-1 block">Email</Label>
                <Input defaultValue={currentUser.email} />
              </div>
              <div>
                <Label className="mb-1 block">Current role</Label>
                <div>
                  <Badge variant="info">{currentUser.role}</Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button>Save changes</Button>
                <Button variant="outline">Sign out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value || "—"}</p>
    </div>
  );
}
