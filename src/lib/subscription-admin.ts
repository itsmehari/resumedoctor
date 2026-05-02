/** Admin UI + API: editable subscription values (matches User.subscription in Prisma). */

export const ADMIN_SUBSCRIPTION_VALUES = [
  "basic",
  "trial",
  "pro_trial_14",
  "pro_monthly",
  "pro_annual",
] as const;

export type AdminSubscriptionValue = (typeof ADMIN_SUBSCRIPTION_VALUES)[number];

export const ADMIN_SUBSCRIPTION_OPTIONS: ReadonlyArray<{
  value: AdminSubscriptionValue;
  label: string;
}> = [
  { value: "basic", label: "Basic" },
  { value: "trial", label: "Trial" },
  { value: "pro_trial_14", label: "Pro trial (14-day, SuperProfile)" },
  { value: "pro_monthly", label: "Pro monthly" },
  { value: "pro_annual", label: "Pro annual" },
];

export function normalizeSubscriptionForAdmin(sub: string): AdminSubscriptionValue | string {
  if (sub === "free") return "basic";
  return sub;
}

/** Safe value for `<select>` when DB may contain legacy strings. */
export function coerceAdminPlanSelectValue(sub: string): AdminSubscriptionValue {
  const n = sub === "free" ? "basic" : sub;
  return ADMIN_SUBSCRIPTION_VALUES.includes(n as AdminSubscriptionValue)
    ? (n as AdminSubscriptionValue)
    : "basic";
}
