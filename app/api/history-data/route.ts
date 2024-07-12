import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

// Визначення схеми валідації для параметрів запиту
const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]), // Валідує часовий період, який може бути "month" або "year"
  month: z.coerce.number().min(0).max(11).default(0), // Валідує місяць (від 0 до 11), перетворює на число
  year: z.coerce.number().min(2000).max(3000), // Валідує рік (від 2000 до 3000), перетворює на число
});

// Асинхронна функція, що обробляє GET-запити
export async function GET(request: Request) {
  const user = await currentUser(); // Отримуємо поточного користувача
  if (!user) {
    // Якщо користувач не аутентифікований
    redirect("/sign-in"); // Перенаправляємо на сторінку входу
  }

  const { searchParams } = new URL(request.url); // Отримуємо параметри запиту з URL
  const timeframe = searchParams.get("timeframe"); // Отримуємо значення параметру "timeframe"
  const year = searchParams.get("year"); // Отримуємо значення параметру "year"
  const month = searchParams.get("month"); // Отримуємо значення параметру "month"

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  }); // Валідовуємо параметри запиту

  if (!queryParams.success) {
    // Якщо параметри не пройшли валідацію
    return Response.json(queryParams.error.message, {
      status: 400, // Повертаємо помилку зі статусом 400 (Bad Request)
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  }); // Отримуємо  дані за допомогою допоміжної функції

  return Response.json(data); // Повертаємо отримані дані у відповідь
}

// Тип для відповіді функції getHistoryData
export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

// Асинхронна функція для отримання даних історії
async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year); // Якщо часовий період "year", отримуємо річні дані
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month); // Якщо часовий період "month", отримуємо місячні дані
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

// Асинхронна функція для отримання річних даних
async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"], // Групуємо дані за місяцями
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc", // Сортуємо місяці у порядку зростання
      },
    ],
  });

  if (!result || result.length === 0) return []; // Якщо результатів немає, повертаємо порожній масив

  const history: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    // Ітеруємося по всіх 12 місяцях
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i); // Знаходимо дані для поточного місяця
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  return history; // Повертаємо річну історію
}

// Асинхронна функція для отримання місячних даних
async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"], // Групуємо дані за днями
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc", // Сортуємо дні у порядку зростання
      },
    ],
  });

  if (!result || result.length === 0) return []; // Якщо результатів немає, повертаємо порожній масив

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month)); // Отримуємо кількість днів у місяці
  for (let i = 1; i <= daysInMonth; i++) {
    // Ітеруємося по всіх днях місяця
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i); // Знаходимо дані для поточного дня
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  return history; // Повертаємо місячну історію
}
