import { z } from "zod";

const InventoryExpenseSchema = z.object({
  expenseType: z.literal("Inventory"),
  selectedInventoryId: z.string().min(1, "Please select an inventory item"),
});

const WagesRentExpenseSchema = z.object({
  expenseType: z.enum(["Wages", "Rent"]),
  to: z.string().min(1, "Name (to) is required"),
  purpose: z.string().min(1, "Purpose is required"),
  totalAmount: z
    .string()
    .nonempty("Total amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Total amount must be a positive number",
    }),
  paidAmount: z
    .string()
    .nonempty("Paid amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Paid amount must be zero or greater",
    }),
  dueAmount: z.number().min(0, "Due amount cannot be negative"),
});

export const ExpenseSchema = z.discriminatedUnion("expenseType", [
  InventoryExpenseSchema,
  WagesRentExpenseSchema,
]);

export type ExpenseForm = z.infer<typeof ExpenseSchema>;

export type ExpenseErrors = Partial<{
  expenseType: string;
  selectedInventoryId: string;
  to: string;
  purpose: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
}>;
