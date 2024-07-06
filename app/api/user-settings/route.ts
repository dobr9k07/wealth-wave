import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  //витягуємо налаштування користувача з БД
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  //Якщо їх не знайдено, створюємо за замовчуванням "UAH"
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "UAH",
      },
    });
  }
  // Перевірка шляху: revalidatePath("/") викликається для перевірки кешованого вмісту, пов'язаного з шляхом "/".
  // Це гарантує, що будь-які зміни в налаштуваннях користувача будуть негайно відображені в інтерфейсі користувача.
  // Без revalidatePath("/") додаток може продовжувати відображати застарілу інформацію з кешу замість оновлених налаштувань користувача,
  // що може призвести до потенційних невідповідностей у представлених даних.
  revalidatePath("/");
  return Response.json(userSettings);
}
