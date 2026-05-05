/**
 * Internal linking: blog ↔ examples (WBS 12.8, Todo 13).
 * Single source of truth for related content.
 */
import { getAllPosts } from "@/lib/blog";
import { getAllExamples } from "@/lib/examples";

/** Blog slug → example slugs (1–4 per post) */
const BLOG_TO_EXAMPLES: Record<string, string[]> = {
  "how-to-write-cv-for-freshers": ["fresher-resume-example"],
  "ats-friendly-resume-complete-guide": ["software-engineer-resume", "data-analyst-resume", "product-manager-resume"],
  "how-to-write-professional-summary": ["marketing-manager-resume", "sales-executive-resume", "data-analyst-resume"],
  "skills-section-guide": ["software-engineer-resume", "data-analyst-resume", "product-manager-resume"],
  "handling-career-gaps-on-resume": ["fresher-resume-example", "data-analyst-resume"],
  "resume-formats-india-guide": ["software-engineer-resume", "fresher-resume-example", "accountant-resume-example"],
  "naukri-linkedin-profile-tips": ["software-engineer-resume", "marketing-manager-resume", "sales-executive-resume"],
  "cover-letter-examples-india": ["software-engineer-resume", "marketing-manager-resume"],
  "resume-length-one-page-or-two": ["fresher-resume-example", "sales-executive-resume"],
  "resume-tips-chennai-job-seekers": ["software-engineer-resume", "bpo-customer-service-resume", "data-analyst-resume"],
  "resume-checklist-before-you-apply": ["software-engineer-resume", "fresher-resume-example", "data-analyst-resume"],
  "how-to-tailor-resume-for-job-description": ["software-engineer-resume", "marketing-manager-resume", "data-analyst-resume"],
  "how-to-read-ats-job-match-feedback": ["data-analyst-resume", "software-engineer-resume", "product-manager-resume"],
  "career-change-resume-india-framing": ["marketing-manager-resume", "data-analyst-resume", "sales-executive-resume"],
};

/** Blog slug → related blog slugs (2–3 by topic, for "Related articles") */
const BLOG_TO_BLOG: Record<string, string[]> = {
  "how-to-write-cv-for-freshers": ["resume-formats-india-guide", "resume-length-one-page-or-two", "resume-checklist-before-you-apply"],
  "ats-friendly-resume-complete-guide": [
    "how-to-read-ats-job-match-feedback",
    "how-to-tailor-resume-for-job-description",
    "skills-section-guide",
  ],
  "how-to-write-professional-summary": ["skills-section-guide", "ats-friendly-resume-complete-guide", "cover-letter-examples-india"],
  "skills-section-guide": ["ats-friendly-resume-complete-guide", "how-to-write-professional-summary", "how-to-tailor-resume-for-job-description"],
  "handling-career-gaps-on-resume": [
    "career-change-resume-india-framing",
    "how-to-write-professional-summary",
    "resume-formats-india-guide",
  ],
  "resume-formats-india-guide": [
    "career-change-resume-india-framing",
    "how-to-write-cv-for-freshers",
    "resume-length-one-page-or-two",
  ],
  "naukri-linkedin-profile-tips": ["ats-friendly-resume-complete-guide", "how-to-tailor-resume-for-job-description", "cover-letter-examples-india"],
  "cover-letter-examples-india": ["how-to-write-professional-summary", "how-to-tailor-resume-for-job-description"],
  "resume-length-one-page-or-two": ["resume-formats-india-guide", "how-to-write-cv-for-freshers", "resume-checklist-before-you-apply"],
  "resume-tips-chennai-job-seekers": ["ats-friendly-resume-complete-guide", "naukri-linkedin-profile-tips"],
  "resume-checklist-before-you-apply": [
    "how-to-read-ats-job-match-feedback",
    "how-to-tailor-resume-for-job-description",
    "resume-length-one-page-or-two",
  ],
  "how-to-tailor-resume-for-job-description": [
    "how-to-read-ats-job-match-feedback",
    "resume-checklist-before-you-apply",
    "ats-friendly-resume-complete-guide",
  ],
  "how-to-read-ats-job-match-feedback": [
    "ats-friendly-resume-complete-guide",
    "how-to-tailor-resume-for-job-description",
    "resume-checklist-before-you-apply",
  ],
  "career-change-resume-india-framing": [
    "handling-career-gaps-on-resume",
    "resume-formats-india-guide",
    "how-to-write-professional-summary",
  ],
};

/** Example slug → blog slugs (2–4 per example) */
const EXAMPLE_TO_BLOG: Record<string, string[]> = {
  "software-engineer-resume": [
    "ats-friendly-resume-complete-guide",
    "how-to-read-ats-job-match-feedback",
    "skills-section-guide",
    "how-to-write-professional-summary",
    "naukri-linkedin-profile-tips",
  ],
  "fresher-resume-example": ["how-to-write-cv-for-freshers", "resume-formats-india-guide", "resume-length-one-page-or-two"],
  "data-analyst-resume": [
    "ats-friendly-resume-complete-guide",
    "how-to-read-ats-job-match-feedback",
    "skills-section-guide",
    "how-to-write-professional-summary",
  ],
  "marketing-manager-resume": [
    "career-change-resume-india-framing",
    "how-to-write-professional-summary",
    "cover-letter-examples-india",
    "naukri-linkedin-profile-tips",
  ],
  "bpo-customer-service-resume": ["resume-formats-india-guide", "resume-tips-chennai-job-seekers"],
  "accountant-resume-example": ["resume-formats-india-guide", "how-to-write-professional-summary"],
  "teacher-educator-resume": ["how-to-write-professional-summary", "resume-formats-india-guide"],
  "sales-executive-resume": [
    "career-change-resume-india-framing",
    "how-to-write-professional-summary",
    "naukri-linkedin-profile-tips",
    "resume-length-one-page-or-two",
  ],
  "hr-manager-resume": ["how-to-write-professional-summary", "resume-formats-india-guide", "cover-letter-examples-india"],
  "product-manager-resume": ["ats-friendly-resume-complete-guide", "skills-section-guide", "how-to-write-professional-summary"],
};

export interface RelatedLink {
  slug: string;
  title: string;
  /** Small label for related-article cards */
  category?: string;
}

function formatTagAsCategory(tags: string[]): string | undefined {
  const t = tags[0];
  if (!t) return undefined;
  return t
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Related resume examples for a blog post (by slug). */
export function getRelatedExamplesForBlog(blogSlug: string): RelatedLink[] {
  const exampleSlugs = BLOG_TO_EXAMPLES[blogSlug];
  if (!exampleSlugs?.length) return [];
  const examples = getAllExamples();
  return exampleSlugs
    .map((slug) => examples.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => !!e)
    .slice(0, 4)
    .map((e) => ({ slug: e.slug, title: e.title }));
}

/** Related blog posts for a blog post (topic-based when mapped, else recent 3). */
export function getRelatedPostsForBlog(currentSlug: string): RelatedLink[] {
  const relatedSlugs = BLOG_TO_BLOG[currentSlug];
  const posts = getAllPosts();
  if (relatedSlugs?.length) {
    return relatedSlugs
      .map((slug) => posts.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        category: formatTagAsCategory(p.tags),
      }));
  }
  return posts
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: formatTagAsCategory(p.tags),
    }));
}

/** Related blog posts for an example page (by example slug). */
export function getRelatedPostsForExample(exampleSlug: string): RelatedLink[] {
  const blogSlugs = EXAMPLE_TO_BLOG[exampleSlug];
  if (!blogSlugs?.length) return [];
  const posts = getAllPosts();
  return blogSlugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: formatTagAsCategory(p.tags),
    }));
}
