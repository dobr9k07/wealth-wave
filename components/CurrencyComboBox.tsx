"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies"; // Імпортуємо дані про валюти
import { useMutation, useQuery } from "@tanstack/react-query"; // Імпортуємо хуки для управління запитами
import SceletonWrapper from "./SkeletonWrapper"; // Імпортуємо компонент обгортки скелету
import { UserSettings } from "@prisma/client"; // Імпортуємо типи з Prisma
// import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings"; // Імпортуємо функцію для оновлення налаштувань користувача
import { toast } from "sonner"; // Імпортуємо бібліотеку для відображення сповіщень
import { UpdateUserCurrency } from "@/app/[locale]/wizard/_actions/userSettings";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false); // Стан для контролю відкриття спливаючого вікна або панелі
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Перевірка, чи є користувач на десктопі
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  ); // Стан для зберігання обраної валюти

  // Запит для отримання налаштувань користувача
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  // Встановлюємо налаштування за замовчуванням (гривня)
  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // Мутація для оновлення валюти користувача
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successfully 🎉`, {
        id: "update-currency",
      });

      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });

  // Функція для вибору опції
  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }

      toast.loading("Updating currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  // Відображення для десктопу
  if (isDesktop) {
    return (
      <SceletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SceletonWrapper>
    );
  }

  // Відображення для мобільних пристроїв
  return (
    <SceletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-[150px] justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SceletonWrapper>
  );
}

// Компонент для списку опцій
function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
