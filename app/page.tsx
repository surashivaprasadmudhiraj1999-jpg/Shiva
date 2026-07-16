import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const capabilities = [
  { title: "Understands your business", copy: "Onboards you once, then remembers everything — products, audience, USP, goals." },
  { title: "Researches your market", copy: "Industry trends, customer pain points, search demand, and buying triggers." },
  { title: "Studies your competitors", copy: "Pricing, positioning, messaging, and the gaps you can exploit." },
  { title: "Builds your strategy", copy: "SEO, social, email, and content strategy tied to a 90-day plan." },
  { title: "Plans your calendar", copy: "A 30-day content calendar and a prioritized task list every morning." },
  { title: "Creates every asset", copy: "Blog posts, ads, emails, social posts — in your brand voice, not a generic one." },
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-sm font-semibold tracking-tight">AI Marketing Employee</span>
        <nav className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-24">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl">
          Hire your first AI Marketing Employee.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Not a chatbot. Not a content generator. A senior marketing employee that
          understands your business, researches your market, builds your strategy,
          and executes — every single day.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link href="/sign-up">
            <Button size="lg">Hire your AI employee</Button>
          </Link>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-neutral-200 p-6 text-left dark:border-neutral-800"
            >
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{c.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{c.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
