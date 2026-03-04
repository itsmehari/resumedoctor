"use client";

import type { ContactSection } from "@/types/resume";

interface Props {
  data: ContactSection["data"];
  onChange: (data: ContactSection["data"]) => void;
}

export function ContactEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Full name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Your full name"
          className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="you@example.com"
            className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Location</label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="Chennai, India"
          className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Website (optional)</label>
        <input
          type="url"
          value={data.website ?? ""}
          onChange={(e) => onChange({ ...data, website: e.target.value || undefined })}
          placeholder="https://..."
          className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
}
