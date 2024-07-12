import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Асинхронна функція, що обробляє GET-запити
export async function GET(request: Request) {
  const user = await currentUser(); // Отримуємо поточного користувача
  if (!user) {
    // Якщо користувач не аутентифікований
    redirect("/sign-in"); // Перенаправляємо на сторінку входу
  }

  const periods = await getHistoryPeriods(user.id); // Отримуємо історію згідно періоду
  return Response.json(periods); // Повертаємо отримані періоди у відповідь
}

// Тип для відповіді функції getHistoryPeriods
export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

// Асинхронна функція для отримання періодів
async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true, // Вибираємо тільки поле "year"
    },
    distinct: ["year"], // Повертаємо тільки унікальні значення поля "year"
    orderBy: [
      {
        year: "asc", // Сортуємо результати за зростанням року
      },
    ],
  });

  const years = result.map((el) => el.year); // Отримуємо масив років із результату запиту
  if (years.length === 0) {
    // Якщо немає даних, повертаємо поточний рік
    return [new Date().getFullYear()];
  }

  return years; // Повертаємо масив років
}
