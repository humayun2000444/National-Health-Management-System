// Currency configuration and utilities

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  position: "before" | "after";
  decimalSeparator: string;
  thousandSeparator: string;
  decimals: number;
}

// Supported currencies
export const currencies: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    position: "before",
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimals: 2,
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    locale: "en-IN",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 0,
  },
  {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    locale: "zh-CN",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    locale: "en-AU",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    locale: "en-CA",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "CHF",
    symbol: "CHF",
    name: "Swiss Franc",
    locale: "de-CH",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: "'",
    decimals: 2,
  },
  {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    locale: "en-SG",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    locale: "ar-AE",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "SAR",
    symbol: "﷼",
    name: "Saudi Riyal",
    locale: "ar-SA",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "MYR",
    symbol: "RM",
    name: "Malaysian Ringgit",
    locale: "ms-MY",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "PHP",
    symbol: "₱",
    name: "Philippine Peso",
    locale: "en-PH",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "THB",
    symbol: "฿",
    name: "Thai Baht",
    locale: "th-TH",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    position: "before",
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimals: 0,
  },
  {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    locale: "ko-KR",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 0,
  },
  {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    locale: "en-ZA",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    locale: "pt-BR",
    position: "before",
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimals: 2,
  },
  {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    locale: "es-MX",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    locale: "en-NG",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "EGP",
    symbol: "E£",
    name: "Egyptian Pound",
    locale: "ar-EG",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
    locale: "en-PK",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "BDT",
    symbol: "৳",
    name: "Bangladeshi Taka",
    locale: "bn-BD",
    position: "before",
    decimalSeparator: ".",
    thousandSeparator: ",",
    decimals: 2,
  },
  {
    code: "VND",
    symbol: "₫",
    name: "Vietnamese Dong",
    locale: "vi-VN",
    position: "after",
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimals: 0,
  },
];

// Default currency
export const DEFAULT_CURRENCY = "USD";

/**
 * Get currency by code
 */
export function getCurrency(code: string): Currency {
  return currencies.find((c) => c.code === code) || currencies[0];
}

/**
 * Format a number as currency
 * Always uses English numerals with currency code (e.g., "1,500.00 BDT")
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currencyCode: string = DEFAULT_CURRENCY,
  options?: {
    showCode?: boolean;
    compact?: boolean;
  }
): string {
  const currency = getCurrency(currencyCode);
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount || 0;

  if (isNaN(numAmount)) {
    return `0 ${currency.code}`;
  }

  let formatted: string;

  if (options?.compact && Math.abs(numAmount) >= 1000) {
    // Compact notation for large numbers
    const absNum = Math.abs(numAmount);
    let suffix = "";
    let divisor = 1;

    if (absNum >= 1000000000) {
      suffix = "B";
      divisor = 1000000000;
    } else if (absNum >= 1000000) {
      suffix = "M";
      divisor = 1000000;
    } else if (absNum >= 1000) {
      suffix = "K";
      divisor = 1000;
    }

    const compactNum = numAmount / divisor;
    formatted = compactNum.toFixed(1).replace(/\.0$/, "") + suffix;
  } else {
    // Always use en-US locale for English numerals with proper formatting
    try {
      formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
      }).format(numAmount);
    } catch {
      // Fallback formatting
      formatted = numAmount.toFixed(currency.decimals);
    }
  }

  // Always show currency code after the amount (e.g., "1,500.00 BDT")
  return `${formatted} ${currency.code}`;
}

/**
 * Parse a currency string to number
 */
export function parseCurrency(
  value: string,
  currencyCode: string = DEFAULT_CURRENCY
): number {
  const currency = getCurrency(currencyCode);

  // Remove currency symbol and code
  let cleaned = value
    .replace(currency.symbol, "")
    .replace(currency.code, "")
    .trim();

  // Handle thousand separators and decimal separators
  if (currency.thousandSeparator === ".") {
    // European style: 1.234,56
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    // US style: 1,234.56
    cleaned = cleaned.replace(/,/g, "");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get currency options for select dropdown
 */
export function getCurrencyOptions(): { value: string; label: string }[] {
  return currencies.map((c) => ({
    value: c.code,
    label: `${c.code} - ${c.name}`,
  }));
}
