"use server";

import prisma from "@/lib/prisma";
import { CreateCategorySchemaType } from "@/schema/categories";
import { CreateTransactionSchema } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Функція для створення нової транзакції
export async function CreateTransaction(form: CreateCategorySchemaType) {
  // Перевіряємо дані форми за допомогою схеми
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message); // Якщо дані невірні, кидаємо помилку
  }

  // Отримуємо поточного користувача
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in"); // Якщо користувач не авторизований, перенаправляємо на сторінку входу
  }

  // Дістаємо дані з перевіреного об'єкта
  const { amount, category, date, description, type } = parsedBody.data;

  // Знаходимо категорію для поточного користувача
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found"); // Якщо категорія не знайдена, кидаємо помилку
  }

  // Виконуємо транзакцію, яка включає створення транзакції та оновлення агрегатних таблиць
  await prisma.$transaction([
    // Створюємо транзакцію користувача
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Оновлюємо місячну агрегатну таблицю
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Оновлюємо річну агрегатну таблицю
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
