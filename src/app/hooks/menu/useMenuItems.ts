import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/_lib/firebase";
import { ItemWithRecordedAt } from "@/components/menu/MenuTable";
export interface MenuItem extends ItemWithRecordedAt {
  id: string;
  name: string;
  category?: string;
  price?: number;
  unit?: string;
  quantity?: number;
  addedBy?: string;
  recordedAt?: Timestamp | null;
  [key: string]:
    | string
    | number
    | boolean
    | Timestamp
    | Date
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | null
    | undefined;
}

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "menu"), orderBy("recordedAt", "desc"));
        const snapshot = await getDocs(q);

        const items: MenuItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          const recordedAt =
            data.recordedAt instanceof Timestamp ? data.recordedAt : null;

          return {
            id: doc.id,
            ...data,
            recordedAt,
          } as MenuItem;
        });

        setMenuItems(items);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { menuItems, loading, error };
};

export default useMenuItems;
