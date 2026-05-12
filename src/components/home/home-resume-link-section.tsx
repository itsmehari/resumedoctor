import Link from "next/link";
import { LandingIcon, LANDING_ICON_PATHS } from "@/components/home/landing-icons";

export function HomeResumeLinkSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.6) 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            <LandingIcon path={LANDING_ICON_PATHS.link} size={12} className="text-cyan-300" />
            Resume link
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your resume,{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
              as a link
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            One URL that always shows your latest version. Paste it on WhatsApp, LinkedIn, recruiter email, or a printed
            QR — update once and every shared link stays current.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Always current",
              body: "Edit your resume once — every link you have shared reflects the update.",
            },
            {
              title: "Mobile-friendly",
              body: "Opens in one tap on phones, without downloading another PDF attachment.",
            },
            {
              title: "Free to publish",
              body: "Share your public resume link at no cost. Pro Link adds vanity URL and analytics.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md ring-1 ring-white/5"
            >
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link
            href="/try"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-dark shadow-xl shadow-cyan-500/20 transition hover:bg-accent-hover"
          >
            <LandingIcon path={LANDING_ICON_PATHS.link} size={18} className="text-accent-dark" />
            Get your resume link
          </Link>
          <Link href="/resume-link" className="text-sm text-cyan-200/90 underline-offset-2 hover:underline">
            How resume links work
          </Link>
        </div>
      </div>
    </section>
  );
}
