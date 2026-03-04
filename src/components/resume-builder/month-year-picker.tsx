"use client";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - 10 + i);

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** Parses "Jan 2022" or "2022" or "01/2022" to { month, year } */
function parse(value: string): { month: number; year: number } | null {
  if (!value?.trim()) return null;
  const v = value.trim();
  const monthIdx = MONTHS.findIndex((m) => v.toLowerCase().startsWith(m.toLowerCase()));
  if (monthIdx >= 0) {
    const yearMatch = v.match(/\d{4}/);
    return { month: monthIdx + 1, year: yearMatch ? parseInt(yearMatch[0], 10) : CURRENT_YEAR };
  }
  const parts = v.split(/[\/\-]/);
  if (parts.length >= 2) {
    const m = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (m >= 1 && m <= 12 && y >= 1990 && y <= 2100) return { month: m, year: y };
  }
  const y = parseInt(v, 10);
  if (y >= 1990 && y <= 2100) return { month: 0, year: y };
  return null;
}

function format(month: number, year: number): string {
  if (month >= 1 && month <= 12) return `${MONTHS[month - 1]} ${year}`;
  return String(year);
}

export function MonthYearPicker({ value, onChange, placeholder = "Jan 2022", disabled, className = "" }: Props) {
  const parsed = parse(value);
  const month = parsed?.month ?? 0;
  const year = parsed?.year ?? CURRENT_YEAR;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = parseInt(e.target.value, 10);
    onChange(format(m, year));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = parseInt(e.target.value, 10);
    onChange(format(month || 1, y));
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <select
        value={month}
        onChange={handleMonthChange}
        disabled={disabled}
        className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      >
        <option value={0}>{placeholder}</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={handleYearChange}
        disabled={disabled}
        className="flex-1 min-w-[70px] rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
