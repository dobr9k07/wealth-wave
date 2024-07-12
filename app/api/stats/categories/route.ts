import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Асинхронна функція, що обробляє GET-запити
export async function GET(request: Request) {
  const user = await currentUser(); // Отримуємо поточного користувача
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from"); // Отримуємо значення параметру "from"
  const to = searchParams.get("to"); // Отримуємо значення параметру "to"

  const queryParams = OverviewQuerySchema.safeParse({ from, to }); // Валідовуємо параметри "from" та "to"
  if (!queryParams.success) {
    // Якщо параметри не пройшли валідацію
    throw new Error(queryParams.error.message); // Кидаємо помилку з повідомленням про невдалу валідацію
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  ); // Отримуємо статистику категорій за допомогою допоміжної функції

  return Response.json(stats); // Повертаємо статистику у відповідь
}

// Тип для відповіді функції getCategoriesStats
export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

// Асинхронна функція для отримання статистики категорій
async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"], // Групуємо транзакції за типом, категорією та іконкою категорії
    where: {
      userId, // Фільтруємо транзакції за ідентифікатором користувача
      date: {
        gte: from, // Дата транзакції має бути більше або дорівнювати значенню "from"
        lte: to, // Дата транзакції має бути менше або дорівнювати значенню "to"
      },
    },
    _sum: {
      amount: true, // Рахуємо суму транзакцій
    },
    orderBy: {
      _sum: {
        amount: "desc", // Сортуємо за сумою транзакцій у порядку зменшення
      },
    },
  });

  return stats; // Повертаємо знайдену статистику
}
