export const Currencies = [
  { value: "UAH", label: "₴ Hryvnia", locale: "uk-UA" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];
