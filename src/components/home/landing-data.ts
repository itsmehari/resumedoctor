import { LANDING_ICON_PATHS } from "@/components/home/landing-icons";

export const HERO_TRUST_POINTS = [
  "30+ ATS-friendly templates for India",
  "Share one resume link on WhatsApp & LinkedIn",
  "AI bullet help and ATS score checks",
] as const;

export const TEMPLATE_QUICK_PICK = [
  { id: "professional-in", name: "Professional", accent: "#0d65d9", users: "2.1K" },
  { id: "cascade", name: "Cascade", accent: "#0f766e", users: "1.8K" },
  { id: "executive", name: "Executive", accent: "#7c3aed", users: "1.4K" },
  { id: "fresher-in", name: "Fresher", accent: "#ea580c", users: "2.6K" },
  { id: "ats-minimal", name: "ATS Minimal", accent: "#334155", users: "1.9K" },
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
      "Browse 30+ ATS-optimised layouts for freshers, mid-career, and senior roles. Filter by style and industry.",
    cta: "Create free ATS-friendly resume",
    href: "/templates",
    icon: LANDING_ICON_PATHS.template,
    tone: "from-primary-500 to-blue-600",
  },
  {
    step: "02",
    title: "Upload or add your details",
    description:
      "Import an existing resume or fill in your profile. AI helps with bullets, summaries, and keyword alignment.",
    cta: "Generate resume with AI",
    href: "/try",
    icon: LANDING_ICON_PATHS.upload,
    tone: "from-violet-500 to-fuchsia-600",
  },
  {
    step: "03",
    title: "…and done.",
    description:
      "Edit anytime, share a live resume link, or export PDF and Word when you upgrade. One profile, many versions.",
    cta: "Create my free resume now",
    href: "/try",
    icon: LANDING_ICON_PATHS.download,
    tone: "from-emerald-500 to-teal-600",
  },
] as const;

export const TEMPLATE_SHOWCASE = [
  { title: "Professional", style: "Modern", badge: "Popular", accent: "#2563eb", layout: "single", slots: 8 },
  { title: "Executive", style: "Two-Column", badge: null, accent: "#7c3aed", layout: "two-column", slots: 7 },
  { title: "Creative", style: "Dark Sidebar", badge: "Trending", accent: "#0f172a", layout: "dark-sidebar", slots: 6 },
] as const;

export const TEMPLATE_FILTERS = [
  { label: "All", category: "" },
  { label: "Modern", category: "modern" },
  { label: "Classic", category: "classic" },
  { label: "Creative", category: "creative" },
  { label: "Minimal", category: "minimal" },
  { label: "Two-Column", category: "executive" },
  { label: "Dark Sidebar", category: "ats" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Arjun Nair",
    role: "Software Engineer at Infosys",
    avatar: "AN",
    color: "bg-primary-600",
    text: "Got 3 interview calls within a week after updating my ResumeDoctor resume on Naukri. The ATS score feature showed me which keywords I was missing.",
  },
  {
    name: "Priya Rajan",
    role: "Marketing Manager at Swiggy",
    avatar: "PR",
    color: "bg-rose-500",
    text: "The templates look polished, not generic. Sharing one resume link on LinkedIn DMs saved me from sending outdated PDFs.",
  },
  {
    name: "Kavitha S.",
    role: "Data Analyst at TCS",
    avatar: "KS",
    color: "bg-violet-600",
    text: "As a fresher I had no idea how to structure a CV. Guided sections and AI bullets helped me land my first offer in six weeks.",
  },
  {
    name: "Rahul Mehta",
    role: "Product Manager",
    avatar: "RM",
    color: "bg-emerald-600",
    text: "I maintain separate resumes for product and strategy roles without reformatting from scratch every time.",
  },
  {
    name: "Ananya Iyer",
    role: "Campus hire, Bengaluru",
    avatar: "AI",
    color: "bg-amber-500",
    text: "OTP Try let me build a draft before signup. Exporting to PDF for campus drives was straightforward once I upgraded.",
  },
  {
    name: "Vikram Das",
    role: "Senior Consultant",
    avatar: "VD",
    color: "bg-slate-700",
    text: "Resume link updates everywhere I have pasted it. Recruiters always see the latest version without another attachment.",
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
