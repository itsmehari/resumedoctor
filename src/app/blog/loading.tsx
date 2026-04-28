export default function BlogIndexLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#faf9f7] dark:bg-slate-950">
      <div className="h-16 border-b border-slate-200 bg-primary-600/90 dark:border-slate-800" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-12 max-w-md rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-8 h-64 rounded-3xl bg-slate-200 dark:bg-slate-700" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
