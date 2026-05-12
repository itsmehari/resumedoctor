import { LANDING_ICON_PATHS } from "@/components/home/landing-icons";

export const HERO_TRUST_POINTS = [
  "30+ ATS-friendly templates for India",
  "Share one resume link on WhatsApp & LinkedIn",
  "AI bullet help and ATS score checks",
] as const;

export const TEMPLATE_QUICK_PICK = [
  { id: "professional-in", name: "Professional", accent: "#0d65d9", hint: "Corporate layouts", category: "professional" },
  { id: "cascade", name: "Cascade", accent: "#0f766e", hint: "Modern header", category: "modern" },
  { id: "executive", name: "Executive", accent: "#7c3aed", hint: "Senior roles", category: "executive" },
  { id: "fresher-in", name: "Fresher", accent: "#ea580c", hint: "Campus & entry", category: "fresher" },
  { id: "ats-minimal", name: "ATS Minimal", accent: "#334155", hint: "Parser-safe", category: "ats" },
] as const;

export const JOB_PORTALS = [
  "Naukri.com",
  "LinkedIn",
  "Indeed India",
  "Internshala",
  "TimesJobs",
  "Shine",
  "Foundit",
] as const;

export const EMPLOYER_LOGOS = [
  "Infosys",
  "TCS",
  "Wipro",
  "HCL",
  "Swiggy",
  "Flipkart",
  "Paytm",
  "Zomato",
  "Razorpay",
  "PhonePe",
  "Freshworks",
  "Ola",
] as const;

export const THREE_STEPS = [
  {
    step: "01",
    title: "Choose your perfect template",
    description:
      "Browse 30+ ATS-optimised layouts for freshers, mid-career, and senior roles. Filter by style, industry, or career stage.",
    cta: "Browse templates",
    href: "/templates",
    icon: LANDING_ICON_PATHS.template,
    tone: "from-primary-500 to-blue-600",
  },
  {
    step: "02",
    title: "Fill in your details",
    description:
      "Start with OTP Try to draft in the builder. After you create an account, import PDF or Word from your dashboard. AI helps with bullets, summaries, and keyword alignment.",
    cta: "Start OTP Try",
    href: "/try",
    icon: LANDING_ICON_PATHS.upload,
    tone: "from-violet-500 to-fuchsia-600",
  },
  {
    step: "03",
    title: "Share, export, and update",
    description:
      "Publish a live resume link for free, keep versions for different roles, and export PDF or Word when you upgrade on SuperProfile.",
    cta: "Get your resume link",
    href: "/resume-link",
    icon: LANDING_ICON_PATHS.download,
    tone: "from-emerald-500 to-teal-600",
  },
] as const;

export const TEMPLATE_SHOWCASE = [
  {
    title: "Professional",
    style: "Corporate",
    badge: "Popular",
    accent: "#2563eb",
    layout: "single",
    slots: 8,
    category: "professional",
  },
  {
    title: "Executive",
    style: "Executive",
    badge: null,
    accent: "#7c3aed",
    layout: "two-column",
    slots: 7,
    category: "executive",
  },
  {
    title: "ATS Minimal",
    style: "ATS",
    badge: "Trending",
    accent: "#0f172a",
    layout: "dark-sidebar",
    slots: 6,
    category: "ats",
  },
] as const;

export const TEMPLATE_FILTERS = [
  { label: "All", category: "" },
  { label: "Professional", category: "professional" },
  { label: "Modern", category: "modern" },
  { label: "Classic", category: "classic" },
  { label: "Creative", category: "creative" },
  { label: "Minimal", category: "minimal" },
  { label: "ATS", category: "ats" },
  { label: "Fresher", category: "fresher" },
  { label: "Executive", category: "executive" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Arjun N.",
    role: "Software engineer job search",
    avatar: "AN",
    color: "bg-primary-600",
    text: "After aligning keywords with the ATS checker, I felt more confident uploading to Naukri and got interview callbacks within a week.",
  },
  {
    name: "Priya R.",
    role: "Marketing manager applications",
    avatar: "PR",
    color: "bg-rose-500",
    text: "The templates look polished, not generic. Sharing one resume link on LinkedIn DMs saved me from sending outdated PDFs.",
  },
  {
    name: "Kavitha S.",
    role: "Fresher / campus hire",
    avatar: "KS",
    color: "bg-violet-600",
    text: "Guided sections and AI bullets helped me structure a first CV I could actually send to campus recruiters.",
  },
  {
    name: "Rahul M.",
    role: "Product manager targeting multiple roles",
    avatar: "RM",
    color: "bg-emerald-600",
    text: "I keep separate resumes for product and strategy roles without reformatting from scratch every time.",
  },
  {
    name: "Ananya I.",
    role: "OTP Try before signup",
    avatar: "AI",
    color: "bg-amber-500",
    text: "OTP Try let me build a draft before creating an account. Exporting to PDF for campus drives was straightforward once I upgraded.",
  },
  {
    name: "Vikram D.",
    role: "Consultant sharing a live link",
    avatar: "VD",
    color: "bg-slate-700",
    text: "My resume link updates everywhere I have pasted it. Recruiters always see the latest version without another attachment.",
  },
] as const;

export const VALUE_PROPS = [
  {
    title: "ATS resume optimised",
    description: "Structured sections and keyword-aware suggestions tuned for Naukri, LinkedIn, and Indeed India.",
    icon: LANDING_ICON_PATHS.ats,
  },
  {
    title: "Tailored resumes, fast",
    description: "Duplicate a resume, tweak for each JD, and keep formatting consistent across versions.",
    icon: LANDING_ICON_PATHS.edit,
  },
  {
    title: "Share everywhere",
    description: "Publish a live resume link for WhatsApp, email, and LinkedIn — free to share, always current.",
    icon: LANDING_ICON_PATHS.link,
  },
] as const;

export const AI_FEATURES = [
  { icon: LANDING_ICON_PATHS.ai, label: "Bullet generator", sub: "Role-specific achievement bullets" },
  { icon: LANDING_ICON_PATHS.ats, label: "ATS score checker", sub: "See match score before you apply" },
  { icon: LANDING_ICON_PATHS.sparkle, label: "Summary writer", sub: "Professional intro in one click" },
] as const;

export const ATS_BEAT_POINTS = [
  "Clean single-column and two-column layouts parsers can read",
  "Standard section labels recruiters and ATS expect in India",
  "Keyword guidance aligned with job descriptions you paste",
  "PDF and Word exports without broken tables or icons",
] as const;
