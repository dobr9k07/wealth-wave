import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Асинхронна функція, що обробляє GET-запити
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from"); // Отримуємо значення параметру "from"
  const to = searchParams.get("to"); // Отримуємо значення параметру "to"

  const queryParams = OverviewQuerySchema.safeParse({ from, to }); // Валідовуємо параметри "from" та "to"

  if (!queryParams.success) {
    // Якщо параметри не пройшли валідацію
    return Response.json(queryParams.error.message, {
      status: 400, // Повертаємо помилку зі статусом 400 (Bad Request)
    });
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  ); // Отримуємо статистику балансу за допомогою допоміжної функції

  return Response.json(stats); // Повертаємо статистику у відповідь
}

// Тип для відповіді функції getBalanceStats
export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

// Асинхронна функція для отримання статистики балансу
async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"], // Групуємо транзакції за типом (витрати або доходи)
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
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0, // Знаходимо суму витрат або повертаємо 0
    income: totals.find((t) => t.type === "income")?._sum.amount || 0, // Знаходимо суму доходів або повертаємо 0
  };
}
