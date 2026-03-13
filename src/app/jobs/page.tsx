// WBS 9.5, 9.6, 9.8 – Job feed UI with keyword matching, filters, and apply tracking
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthNav } from "@/components/auth-nav";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Bookmark, BookmarkCheck, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  industry: string | null;
  description: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  url: string | null;
  createdAt: string;
  matchScore: number;
  saved: boolean;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_LABELS: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  rejected: "Rejected",
  offer: "Offer",
};

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  applied: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  interviewing: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  offer: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    currency === "INR"
      ? n >= 100000
        ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
        : `₹${n.toLocaleString("en-IN")}`
      : `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `up to ${fmt(max!)}`;
}

export default function JobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [resumes, setResumes] = useState<Array<{ id: string; title: string }>>([]);
  const [appliedStatus, setAppliedStatus] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"browse" | "applications">("browse");
  const [applications, setApplications] = useState<Array<{ jobId: string; status: string; job: Job; updatedAt: string }>>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/resumes", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : { resumes: [] }))
        .then((d) => setResumes(d.resumes ?? []));
    }
  }, [session?.user?.email]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "9" });
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (industry) params.set("industry", industry);
    if (resumeId) params.set("resumeId", resumeId);
    const res = await fetch(`/api/jobs?${params}`, { credentials: "include" });
    if (res.ok) {
      const data: JobsResponse = await res.json();
      setJobs(data.jobs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [page, query, location, industry, resumeId]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/jobs/applications", { credentials: "include" });
    if (res.ok) {
      const d = await res.json();
      setApplications(d.applications ?? []);
      const statusMap: Record<string, string> = {};
      for (const a of d.applications ?? []) statusMap[a.jobId] = a.status;
      setAppliedStatus(statusMap);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) fetchApplications();
  }, [session?.user?.email, fetchApplications]);

  async function handleApply(jobId: string, newStatus: string) {
    const prev = appliedStatus[jobId];
    setAppliedStatus((s) => ({ ...s, [jobId]: newStatus }));
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setAppliedStatus((s) => ({ ...s, [jobId]: prev }));
    } else {
      fetchApplications();
    }
  }

  async function handleUnsave(jobId: string) {
    await fetch(`/api/jobs/${jobId}/apply`, { method: "DELETE", credentials: "include" });
    setAppliedStatus((s) => { const n = { ...s }; delete n[jobId]; return n; });
    fetchApplications();
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">ResumeDoctor</Link>
          <nav className="flex items-center gap-4">
            <Link href="/jobs" className="font-medium text-primary-600">Jobs</Link>
            <AuthNav />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Job Board</h1>
            <p className="text-slate-500 text-sm mt-1">Curated jobs across India. Select a resume for keyword-match scoring.</p>
          </div>
          <div className="flex gap-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "browse" ? "bg-primary-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "applications" ? "bg-primary-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              My Applications {applications.length > 0 && <span className="ml-1 text-xs">({applications.length})</span>}
            </button>
          </div>
        </div>

        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs…"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Location…"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Industry…"
                    value={industry}
                    onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
                <select
                  value={resumeId}
                  onChange={(e) => { setResumeId(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="">Match with resume…</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">{loading ? "Loading..." : `${total} job${total !== 1 ? "s" : ""} found`}</p>

            {/* Job cards */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No jobs found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => {
                  const currentStatus = appliedStatus[job.id];
                  return (
                    <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-1">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm leading-tight">{job.title}</h3>
                          <p className="text-slate-500 text-xs mt-0.5">{job.company}</p>
                        </div>
                        {resumeId && job.matchScore > 0 && (
                          <span className={`ml-2 shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${job.matchScore >= 60 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : job.matchScore >= 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                            {job.matchScore}% match
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                        {job.location && (
                          <span className="flex items-center gap-0.5 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />{job.location}
                          </span>
                        )}
                        {job.industry && (
                          <span className="text-xs text-slate-500">{job.industry}</span>
                        )}
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 flex-1 mb-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 4).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && <span className="text-xs text-slate-400">+{job.skills.length - 4}</span>}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                          {currentStatus ? (
                            <div className="flex items-center gap-1">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleApply(job.id, e.target.value)}
                                className={`text-xs rounded px-1.5 py-0.5 border-0 font-medium cursor-pointer ${STATUS_COLORS[currentStatus] ?? STATUS_COLORS.saved}`}
                              >
                                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                                  <option key={v} value={v}>{l}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleUnsave(job.id)}
                                className="text-slate-400 hover:text-red-500"
                                title="Remove"
                              >
                                <BookmarkCheck className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApply(job.id, "saved")}
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <Bookmark className="h-3.5 w-3.5" /> Save
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                          {job.url && (
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "applications" && (
          <div>
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <BookmarkCheck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No applications yet</p>
                <p className="text-slate-400 text-sm mt-1">Save jobs from the Browse tab to track them here.</p>
                <button onClick={() => setActiveTab("browse")} className="mt-4 text-sm text-primary-600 hover:underline">Browse jobs →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((a) => (
                  <div key={a.jobId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{a.job.title}</p>
                      <p className="text-xs text-slate-500">{a.job.company} · {a.job.location}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <select
                        value={a.status}
                        onChange={(e) => handleApply(a.jobId, e.target.value)}
                        className={`text-xs rounded px-2 py-1 border border-slate-200 dark:border-slate-600 font-medium cursor-pointer ${STATUS_COLORS[a.status] ?? STATUS_COLORS.saved}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                      {a.job.url && (
                        <a href={a.job.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button onClick={() => handleUnsave(a.jobId)} className="text-slate-400 hover:text-red-500" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Trash2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
