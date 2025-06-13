import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase"; 

export const useTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const transactionSnap = await getDocs(
          query(collection(db, "transaction"), orderBy("recordedAt", "desc"))
        );
        const incomeData = transactionSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const expensesSnap = await getDocs(
          query(collection(db, "expenses"), orderBy("recordedAt", "desc"))
        );
        const expensesData = expensesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allData = [...incomeData, ...expensesData].sort((a, b) => {
          const aDate = a.recordedAt?.toDate?.() || new Date(0);
          const bDate = b.recordedAt?.toDate?.() || new Date(0);
          return bDate - aDate;
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
