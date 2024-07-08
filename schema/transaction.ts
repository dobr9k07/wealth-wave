import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01), //Перевірка, чи число має не більше двох знаків після коми.
  description: z.string().optional(), //Приймати значення або типу рядок, або взагалі без значення.
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
