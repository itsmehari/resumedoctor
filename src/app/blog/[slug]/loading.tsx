export default function BlogPostLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#faf9f7] dark:bg-slate-950">
      <div className="h-16 border-b border-slate-200 bg-primary-600/90 dark:border-slate-800" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-8 h-10 max-w-2xl rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-4 max-w-xl rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-10 grid gap-8 xl:grid-cols-[14rem_1fr]">
          <div className="hidden xl:block">
            <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
