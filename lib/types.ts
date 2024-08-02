export type TransactionType = "income" | "expense";
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };

export const locales = ["en", "ua"] as const;
export type Locale = (typeof locales)[number];
