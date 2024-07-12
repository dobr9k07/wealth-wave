import { MAX_DATE_RANGE_DAYS } from "@/lib/constans"; // Імпорт константи, яка визначає максимальний діапазон днів
import { differenceInDays } from "date-fns"; // Імпорт функції для обчислення різниці у днях між двома датами
import { z } from "zod";

// Визначення схеми валідації для параметрів "from" та "to"
export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(), // Валідує та перетворює значення "from" на дату
    to: z.coerce.date(), // Валідує та перетворює значення "to" на дату
  })
  .refine((args) => {
    // Додає додаткову перевірку
    const { from, to } = args;
    const days = differenceInDays(to, from); // Обчислює різницю у днях між "to" та "from"

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS; // Перевіряє, чи діапазон дат є допустимим
    return isValidRange; // Повертає true, якщо діапазон є допустимим, і false, якщо ні
  });
