export type SupportedCurrency = "INR" | "USD" | "EUR";

export type ExchangeRates = Record<SupportedCurrency, number>;

export const supportedCurrencies: SupportedCurrency[] = ["INR", "USD", "EUR"];

export const defaultCurrency: SupportedCurrency = "INR";

export const defaultExchangeRates: ExchangeRates = {
  INR: 1,
  USD: 1,
  EUR: 1,
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return supportedCurrencies.includes(value as SupportedCurrency);
}

export function getAssetBaseCurrency(type: "stock" | "crypto") {
  return type === "crypto" ? "USD" : "INR";
}

export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  rates: ExchangeRates
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    return amount;
  }

  const amountInUsd = amount / fromRate;

  return amountInUsd * toRate;
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency
) {
  return new Intl.NumberFormat("en-IN", {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(amount);
}
