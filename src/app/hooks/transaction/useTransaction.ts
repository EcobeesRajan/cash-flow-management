import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/_lib/firebase";

type TransactionRecord = {
  id: string;
  category?: string;
  type?: string;
  recordedAt?: Timestamp | null;
  [key: string]: string | number | boolean | Timestamp | undefined | null;
};

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const transactionSnap = await getDocs(
          query(collection(db, "transaction"), orderBy("recordedAt", "desc"))
        );
        const incomeData: TransactionRecord[] = transactionSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        const expensesSnap = await getDocs(
          query(collection(db, "expenses"), orderBy("recordedAt", "desc"))
        );
        const expensesData: TransactionRecord[] = expensesSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        const allData = [...incomeData, ...expensesData].sort((a, b) => {
          const aDate = a.recordedAt?.toDate?.() || new Date(0);
          const bDate = b.recordedAt?.toDate?.() || new Date(0);
          return bDate.getTime() - aDate.getTime();
        });

        setTransactions(allData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  return { transactions, loading };
};
