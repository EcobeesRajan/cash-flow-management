export type Transaction = {
  id: string;
  type: "income" | "expense" | "Records";
  category?: string;
  menuId?: string;
  menuName?: string;
  ExpensesName?:string;
  menuUnitPrice?: string;
  menu_price?: number;
  quantity?: number;
  Total_price?: number;
  totalAmount?: number;
  cash?: number;
  online?: number;
  Logs?: string;
  added_by?: string;
  status? : string;
  role?: string;
  purpose? : string;
["inventory-price"]?: number;
["inventory-quantity"]?: number;
["inventory-name"]? : string;
["addedBy"]? : string;

to? : string;
  recordedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  name?: string;
};
