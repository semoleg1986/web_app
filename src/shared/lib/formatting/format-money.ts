const DEFAULT_MONEY_LOCALE = "en-US";

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(DEFAULT_MONEY_LOCALE, {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}
