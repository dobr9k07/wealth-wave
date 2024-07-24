"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types"; // Імпортуємо тип транзакції
import { Category } from "@prisma/client"; // Імпортуємо тип категорії з Prisma
import { useQuery } from "@tanstack/react-query"; // Імпортуємо хук для запитів
import React, { useCallback, useEffect } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog"; // Імпортуємо компонент для створення нової категорії
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Імпортуємо утиліту для об'єднання класів

interface Props {
  type: TransactionType; // Властивість для типу транзакції (дохід або витрата)
  onChange: (value: string) => void; // Колбек для зміни значення
}

function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = React.useState(false); // Стейт для відкриття/закриття поповеру
  const [value, setValue] = React.useState(""); // Стейт для вибраної категорії

  useEffect(() => {
    if (!value) return;
    onChange(value); // При зміні значення викликаємо колбек
  }, [onChange, value]);

  // Використовуємо useQuery для отримання списку категорій
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`api/categories?type=${type}`).then((res) => res.json()),
  });

  // Знаходимо вибрану категорію
  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );

  // Колбек для успішного створення нової категорії
  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

// Компонент для рендерингу рядка категорії
function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
