import { z } from "zod";

export const InventorySchema = z.object({
  name: z.string().trim().min(3, "Item Name must be 3 character"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Enter the Price",
  }),
  unitOfPrice: z.enum(["Pack", "Pieces", "Kg", "Litres"], {
    errorMap: () => ({ message: "Select a unit of price" }),
  }),
  category: z.enum(["Food", "Utensils", "Drinks", "Others"], {
    errorMap: () => ({ message: "Select a category" }),
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Empty Quantity number",
  }),
});

export type InventoryForm = z.infer<typeof InventorySchema>;
export type InventoryErrors = Partial<Record<keyof InventoryForm, string>>;
