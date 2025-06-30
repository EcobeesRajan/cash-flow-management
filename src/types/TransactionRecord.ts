import { Timestamp } from "firebase/firestore";

export type TransactionRecord = {
  id: string;
  type?: string;
  category?: string;
  recordedAt?: Timestamp | null;
  [key: string]:| string| number| boolean| Timestamp| Date| string[]| number[]| boolean[]| Record<string, unknown>| null| undefined;
};
