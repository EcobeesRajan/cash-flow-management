import { z } from "zod";

export const IncomeSchema = z
  .object({
    selectedItemId: z.string().min(1, "Please select a menu item"),

    quantity: z
      .number({
        error: "Quantity must be a number",
      })
      .min(1, "Quantity must be at least 1"),

    paymentType: z.enum(["Cash", "Online", "Cash + Online"], {
      message: "Please select a payment type",
    }),

    cashAmount: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({ error: "Cash amount must be a number" })
        .optional()
    ),

    onlineAmount: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({ error: "Online amount must be a number" })
        .optional()
    ),

    note: z.string().min(1, "Note is required"),
  })

  // Cash + Online both must be > 0
  .refine(
    (data) =>
      data.paymentType !== "Cash + Online" ||
      (typeof data.cashAmount === "number" &&
        data.cashAmount > 0 &&
        typeof data.onlineAmount === "number" &&
        data.onlineAmount > 0),
    {
      message: "Both cash and online amounts must be greater than zero",
      path: ["cashAmount"],
    }
  )

  .refine(
    (data) =>
      data.paymentType !== "Online" ||
      (typeof data.onlineAmount === "number" && data.onlineAmount > 0),
    {
      message: "Online amount must be greater than zero",
      path: ["onlineAmount"],
    }
  )

  .refine(
    (data) =>
      data.paymentType !== "Cash" ||
      (typeof data.cashAmount === "number" && data.cashAmount > 0),
    {
      message: "Cash amount must be greater than zero",
      path: ["cashAmount"],
    }
  );

export type IncomeFormType = z.infer<typeof IncomeSchema>;
