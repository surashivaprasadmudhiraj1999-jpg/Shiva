"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SearchOS</span>
        </div>

        <Card>
          <CardContent className="p-6">
            <h1 className="text-lg font-semibold">{mode === "signin" ? "Sign in to your workspace" : "Create your workspace"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">SEO · AEO · GEO productivity in one place.</p>

            <div className="mt-5 space-y-3">
              <div>
                <Label className="mb-1 block">Work email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@agency.com" />
              </div>
              <div>
                <Label className="mb-1 block">Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                {mode === "signin" ? "Sign in" : "Create workspace"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-[hsl(32_60%_32%)]">
              <Badge variant="warning" className="mb-1">
                Demo
              </Badge>
              <p>
                Authentication is wired for Supabase but disabled in this demo. Any details take you straight to a fully populated sample
                workspace.
              </p>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-primary hover:underline">
                {mode === "signin" ? "Create a workspace" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:underline">
            Skip to demo dashboard →
          </Link>
        </p>
      </div>
    </div>
  );
}
