import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Асинхронна функція, що обробляє GET-запити
export async function GET(request: Request) {
  //Аутентифікація користувача
  const user = await currentUser(); // Отримуємо поточного користувача
  if (!user) {
    // Якщо користувач не аутентифікований
    redirect("/sing-in");
  }

  const { searchParams } = new URL(request.url); // Отримуємо параметри запиту з URL

  const paramType = searchParams.get("type"); // Отримуємо значення параметру "type"

  const validator = z.enum(["expense", "income"]).nullable(); // Створюємо валідатор для параметру "type" з можливими значеннями "expense" та "income", або null

  const queryParams = validator.safeParse(paramType); // Валідовуємо параметр "type"

  if (!queryParams.success) {
    // Якщо параметр не пройшов валідацію
    return Response.json(queryParams.error, {
      status: 400, // Повертаємо помилку зі статусом 400 (Bad Request)
    });
  }

  const type = queryParams.data; // Отримуємо валідоване значення параметру "type"

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id, // Фільтруємо категорії за ідентифікатором користувача
      ...(type && { type }), // Якщо параметр "type" визначений, додаємо його до фільтра
    },
    orderBy: {
      name: "asc", // Сортуємо категорії за іменем у порядку зростання
    },
  });

  return Response.json(categories); // Повертаємо знайдені категорії у відповідь
}
