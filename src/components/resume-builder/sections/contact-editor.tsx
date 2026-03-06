"use client";

import type { ContactSection } from "@/types/resume";

interface Props {
  data: ContactSection["data"];
  onChange: (data: ContactSection["data"]) => void;
}

const inputCls = "mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";
const labelCls = "block text-xs font-medium text-slate-600 dark:text-slate-400";

export function ContactEditor({ data, onChange }: Props) {
  const set = (field: keyof typeof data, value: string) =>
    onChange({ ...data, [field]: value || undefined });

  return (
    <div className="space-y-3">
      {/* Name */}
      <div>
        <label className={labelCls}>Full name</label>
        <input type="text" value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Your full name" className={inputCls} />
      </div>

      {/* Professional headline */}
      <div>
        <label className={labelCls}>
          Professional headline <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input type="text" value={data.title ?? ""} onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Senior Software Engineer · React Specialist"
          className={inputCls} />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="you@example.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input type="tel" value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+91 98765 43210" className={inputCls} />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>Location</label>
        <input type="text" value={data.location} onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="Chennai, India" className={inputCls} />
      </div>

      {/* LinkedIn + GitHub */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>LinkedIn <span className="font-normal text-slate-400">(optional)</span></label>
          <input type="text" value={data.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)}
            placeholder="linkedin.com/in/yourname" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>GitHub <span className="font-normal text-slate-400">(optional)</span></label>
          <input type="text" value={data.github ?? ""} onChange={(e) => set("github", e.target.value)}
            placeholder="github.com/yourname" className={inputCls} />
        </div>
      </div>

      {/* Portfolio + Website */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Portfolio <span className="font-normal text-slate-400">(optional)</span></label>
          <input type="url" value={data.portfolio ?? ""} onChange={(e) => set("portfolio", e.target.value)}
            placeholder="yoursite.dev" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Website <span className="font-normal text-slate-400">(optional)</span></label>
          <input type="url" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)}
            placeholder="https://..." className={inputCls} />
        </div>
      </div>
    </div>
  );
}
