/**
 * Build-time "edition" — determines which installer is being built; unrelated to the user-switchable UI language (locale).
 *  - "cn"   : Domestic edition — wallet is shown in "credits" ($1 = 1000 credits, see balanceToCredits). Top-up is still settled in USD via Stripe.
 *  - "intl" : International edition — wallet is shown in US dollars ($).
 *
 * Determined by the NEXT_PUBLIC_APP_EDITION environment variable at `next build` time and baked into the render-layer bundle by Next;
 * defaults to the international edition when unset. Just run a build once per installer with a different NEXT_PUBLIC_APP_EDITION (see dist:*:cn / :intl in package.json).
 */
import { balanceToCredits } from "@/constants/Credit";

export type AppEdition = "cn" | "intl";

export const APP_EDITION: AppEdition =
  process.env.NEXT_PUBLIC_APP_EDITION === "cn" ? "cn" : "intl";

export const isCnEdition = APP_EDITION === "cn";

/**
 * Display text for the wallet balance (switches by edition). `value` is the backend wallet balance, in US dollars (see constants/Credit.ts).
 *  - Domestic edition: converted to credits (balance × 1000, rounded down), with thousands separators, e.g. "1,000".
 *  - International edition: shown as a US dollar amount with two decimals, e.g. "$1.00".
 *
 * Two decimals everywhere: balances carry sub-cent precision internally (per-step LLM billing accrues fractions),
 * but only per-token unit prices should ever show more (docs/stripe-frontend-integration.md §4.5).
 */
export function formatWallet(value: number | undefined | null): string {
  if (isCnEdition) return balanceToCredits(value).toLocaleString();
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `$${v.toFixed(2)}`;
}
