"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition(); // Встановлюємо перехідний стан і функцію для запуску переходу
  const router = useRouter(); // Отримуємо об'єкт маршрутизатора
  const localeActive = useLocale(); // Отримуємо поточну локаль

  // Функція для обробки зміни вибраної локалі
  const onToggleChange = (nextLocale: string) => {
    // Починаємо перехід на нову локаль
    startTransition(() => {
      // Заміна поточного маршруту на новий з обраною локаллю
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <ToggleGroup
      type="single"
      // className="border-2 rounded"
      value={localeActive}
      onValueChange={onToggleChange}
      disabled={isPending}
    >
      <ToggleGroupItem value="en" aria-label="Switch to English">
        Eng
      </ToggleGroupItem>
      <ToggleGroupItem value="ua" aria-label="Switch to Ukraine">
        Ukr
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
