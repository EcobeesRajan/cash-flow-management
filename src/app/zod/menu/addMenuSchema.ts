import { z } from "zod";

export const AddMenuSchema = z.object({
  name: z.string().trim().min(3, "Name must be 3 characters required"),
  category: z.enum(["Tea", "Snacks", "Drinks", "Others"], {
    message: "Please select a category",
  }),
  price: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string()
      .nonempty("Price is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: "Price is empty. Enter a valid number",
      })
  ),
  unit: z.enum(["Pics", "Packet", "Cup"], {
    message: "Please select a unit",
  }),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string()
      .nonempty("Quantity is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: "Quantity is empty",
      })
  ),
});

export type AddMenuForm = z.infer<typeof AddMenuSchema>;
export type AddMenuErrors = Partial<Record<keyof AddMenuForm, string>>;
