"use client";

import { Category } from "@prisma/client"; // Імпортуємо тип для категорії
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Імпортуємо хук для мутацій та клієнт запитів
import { ReactNode } from "react"; // Імпортуємо ReactNode для типізації тригера
import { DeleteCategory } from "../_actions/categories"; // Імпортуємо функцію для видалення категорії
import { toast } from "sonner"; // Імпортуємо бібліотеку для сповіщень
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Імпортуємо компоненти для діалогового вікна
import { TransactionType } from "@/lib/types"; // Імпортуємо тип для транзакцій

interface Props {
  trigger: ReactNode; // Компонент або елемент, який буде тригером для відкриття діалогового вікна
  category: Category; // Категорія, яку потрібно видалити
}

function DeleteCategoryDialog({ category, trigger }: Props) {
  const categoryIdentifier = `${category.name}-${category.type}`; // Унікальний ідентифікатор категорії
  const queryClient = useQueryClient(); // Хук для доступу до клієнта запитів

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory, // Функція для видалення категорії
    onSuccess: async () => {
      toast.success("Category deleted successfully", {
        id: categoryIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"], // Оновлюємо запити для категорій після видалення
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: categoryIdentifier,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", {
                id: categoryIdentifier,
              });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;
