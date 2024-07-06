import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    //Перевіряємо, чи значення валюти (передане як value) існує в масиві Currencies.
    const found = Currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`invalid currency: ${value}`);
    }

    return value;
  }),
});
