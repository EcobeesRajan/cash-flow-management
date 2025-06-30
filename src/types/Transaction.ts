export type Transaction = {
  id: string;
  type: "income" | "expense";
  category?: string;
  menuId?: string;
  menuName?: string;
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
  recordedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  name?: string;
};
