import { requireUser } from "@/services/auth";
import { OnboardingForm } from "@/features/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <div className="min-h-screen bg-white px-6 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Let&apos;s get to know your business
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Answer a few questions once. I&apos;ll remember everything and start
          researching, planning, and creating right away.
        </p>
      </div>
      <div className="mt-12">
        <OnboardingForm />
      </div>
    </div>
  );
}
