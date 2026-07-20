/**
 * Credit-exchange constants
 *
 * Pricing system: $1 = 1000 credits (i.e. $0.001 per credit)
 * The wallet balance is stored in the backend `walletBalance` field, in units of "US dollars"
 *
 * ⚠️ The platform's base currency changed from CNY to USD (docs/stripe-frontend-integration.md §4):
 * every balance, price and budget the API returns is now USD, so the raw numbers are ~6.8x smaller
 * than before the cutover. Credit counts themselves were deliberately left unchanged by that migration.
 */

/** Number of credits per US dollar */
export const CREDITS_PER_USD = 1000;

/** Minimum number of credits for a custom purchase (mirrors the $2.00 minimum top-up) */
export const MIN_CUSTOM_CREDITS = 2000;

/** Unit price (USD per credit) */
export const CREDIT_UNIT_PRICE = 1 / CREDITS_PER_USD;

/**
 * Convert a wallet balance (USD) to credits.
 * @param balanceInUsd wallet balance, in US dollars
 * @returns the corresponding credit count (rounded down to avoid over-displaying)
 */
export function balanceToCredits(balanceInUsd: number | undefined | null): number {
  if (balanceInUsd == null || balanceInUsd === 0) return 0;
  return Math.floor(balanceInUsd * CREDITS_PER_USD);
}
