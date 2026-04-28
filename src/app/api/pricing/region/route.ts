// WBS 10.9 – Geotargeted pricing: return currency/plans by country
import { NextResponse } from "next/server";

const IN_CURRENCY = "INR";
const DEFAULT_CURRENCY = "USD";

const PLANS_INR = [
  { id: "pro_monthly", name: "Pro Monthly", price: "₹199", period: "/month", priceValue: 199 },
  { id: "pro_annual", name: "Pro Annual", price: "₹1,499", period: "/year", priceValue: 1499, savings: "Save 37%" },
];

const PLANS_USD = [
  { id: "pro_monthly", name: "Pro Monthly", price: "$4.99", period: "/month", priceValue: 4.99 },
  { id: "pro_annual", name: "Pro Annual", price: "$39", period: "/year", priceValue: 39, savings: "Save 35%" },
];

export async function GET(req: Request) {
  const country = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;
  const isIndia = country === "IN";
  const currency = isIndia ? IN_CURRENCY : DEFAULT_CURRENCY;
  const plans = isIndia ? PLANS_INR : PLANS_USD;
  return NextResponse.json({ country: country ?? "unknown", currency, plans });
}
