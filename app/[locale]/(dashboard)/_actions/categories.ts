"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories"; // Імпортуємо схеми для створення та видалення категорій
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Функція для створення нової категорії
export async function CreateCategory(form: CreateCategorySchemaType) {
  // Перевіряємо дані форми за допомогою схеми
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request"); // Якщо дані невірні, кидаємо помилку
  }

  // Отримуємо поточного користувача
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in"); // Якщо користувач не авторизований, перенаправляємо на сторінку входу
  }

  // Дістаємо дані з перевіреного об'єкта
  const { name, icon, type } = parsedBody.data;

  // Створюємо нову категорію в базі даних
  return await prisma.category.create({
    data: {
      userId: user.id, // Зв'язуємо категорію з поточним користувачем
      name,
      icon,
      type,
    },
  });
}

// Функція для видалення категорії
export async function DeleteCategory(form: DeleteCategorySchemaType) {
  // Перевіряємо дані форми за допомогою схеми
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request"); // Якщо дані невірні, кидаємо помилку
  }

  // Отримуємо поточного користувача
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in"); // Якщо користувач не авторизований, перенаправляємо на сторінку входу
  }

  // Видаляємо категорію з бази даних
  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id, // Використовуємо комбінацію імені, ID користувача та типу для пошуку категорії
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
