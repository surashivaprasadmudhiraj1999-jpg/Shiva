"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/actions/onboarding";
import type { OnboardingAnswers } from "@/types";

const CHANNELS = ["SEO", "Social Media", "Email", "Paid Ads", "Content Marketing", "Community"];

const steps = [
  "About your business",
  "Your customers & competitors",
  "Goals & budget",
  "Brand voice",
] as const;

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    businessName: "",
    industry: "",
    website: "",
    productOrService: "",
    customers: "",
    differentiator: "",
    competitors: "",
    goals: [],
    monthlyBudget: undefined,
    preferredChannels: [],
    brandTone: "",
    anythingElse: "",
  });

  function update<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function toggleChannel(channel: string) {
    setAnswers((a) => ({
      ...a,
      preferredChannels: a.preferredChannels.includes(channel)
        ? a.preferredChannels.filter((c) => c !== channel)
        : [...a.preferredChannels, channel],
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await completeOnboarding(answers);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  const isLastStep = step === steps.length - 1;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col gap-1">
            <div
              className={`h-1 rounded-full ${i <= step ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-800"}`}
            />
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {steps[step]}
      </h2>

      <div className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="businessName">What is your business?</Label>
              <Input
                id="businessName"
                value={answers.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={answers.industry}
                onChange={(e) => update("industry", e.target.value)}
                placeholder="B2B SaaS, ecommerce, coaching..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={answers.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://acme.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productOrService">What product or service do you sell?</Label>
              <Textarea
                id="productOrService"
                rows={3}
                value={answers.productOrService}
                onChange={(e) => update("productOrService", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customers">Who are your customers?</Label>
              <Textarea
                id="customers"
                rows={3}
                value={answers.customers}
                onChange={(e) => update("customers", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="differentiator">What makes you different?</Label>
              <Textarea
                id="differentiator"
                rows={3}
                value={answers.differentiator}
                onChange={(e) => update("differentiator", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="competitors">Who are your competitors? (comma-separated)</Label>
              <Input
                id="competitors"
                value={answers.competitors}
                onChange={(e) => update("competitors", e.target.value)}
                placeholder="Competitor A, Competitor B"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="goals">What are your goals? (one per line)</Label>
              <Textarea
                id="goals"
                rows={3}
                value={answers.goals.join("\n")}
                onChange={(e) => update("goals", e.target.value.split("\n").filter(Boolean))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="budget">Monthly marketing budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={answers.monthlyBudget ?? ""}
                onChange={(e) => update("monthlyBudget", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Preferred marketing channels</Label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((channel) => (
                  <button
                    type="button"
                    key={channel}
                    onClick={() => toggleChannel(channel)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      answers.preferredChannels.includes(channel)
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brandTone">Brand tone</Label>
              <Input
                id="brandTone"
                value={answers.brandTone}
                onChange={(e) => update("brandTone", e.target.value)}
                placeholder="Professional, bold, playful, technical..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="anythingElse">Anything else?</Label>
              <Textarea
                id="anythingElse"
                rows={3}
                value={answers.anythingElse}
                onChange={(e) => update("anythingElse", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
        >
          Back
        </Button>
        {isLastStep ? (
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Building your marketing department…" : "Finish onboarding"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={!answers.businessName}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
