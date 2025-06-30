export type MenuItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
};

export type IncomeFormProps = {
  menuItems: MenuItem[];
  selectedItemId: string;
  setSelectedItemId: (id: string) => void;
  selectedItem: MenuItem | null;
  quantity: number;
  setQuantity: (qty: number) => void;
  paymentType: string;
  setPaymentType: (type: string) => void;
  cashAmount: string | number;
  setCashAmount: (val: string | number) => void;
  onlineAmount: string | number;
  setOnlineAmount: (val: string | number) => void;
  note: string;
  setNote: (note: string) => void;
  saving: boolean;
  handleSave: () => void;
  total: number;
};
