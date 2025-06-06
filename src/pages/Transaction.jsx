import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {

        const q = query(
          collection(db, "transaction"),
          orderBy("RecordedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const isWithinDateRange = (date) => {
    if (!startDate && !endDate) return true;
    if (!date?.toDate) return false;
    const d = date.toDate();
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate)) return false;
    return true;
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      typeFilter === "all" ||
      t.category?.toLowerCase() === typeFilter.toLowerCase();
    const matchesDate = isWithinDateRange(t.RecordedAt);
    return matchesType && matchesDate;
  });

  const groupByDate = (data) => {
    const groups = {};
    const todayObj = new Date();
    const yesterdayObj = new Date();
    yesterdayObj.setDate(todayObj.getDate() - 1);

    data.forEach((t) => {
      if (!t.RecordedAt) return;
      const dateObj = t.RecordedAt.toDate();

      let label;
      if (dateObj.toDateString() === todayObj.toDateString()) label = "Today";
      else if (dateObj.toDateString() === yesterdayObj.toDateString())
        label = "Yesterday";
      else
        label = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });

    return groups;
  };

  const grouped = groupByDate(filteredTransactions);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <button onClick={() => navigate(-1)} className="text-blue-600">
          Back
        </button>
        <div className="flex gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="Rent">Rent</option>
            <option value="Wages">Wages</option>
            <option value="Inventory">Inventory</option>
            <option value="Income">Income</option>
          </select>
          <input
            type="date"
            max={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            max={today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Transaction Records
      </h2>

      {(startDate || endDate || typeFilter !== "all") && (
        <div className="text-center text-sm text-gray-600 mb-4">
          Showing {typeFilter !== "all" ? typeFilter : "all types"} from{" "}
          {startDate || "beginning"} to {endDate || "today"}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white p-4 rounded shadow"
            >
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-gray-500">No transactions found.</p>
          ) : (
            Object.entries(grouped).map(([groupLabel, records]) => (
              <div key={groupLabel}>
                <h3 className="text-lg font-semibold mb-2">{groupLabel}</h3>
                <div className="space-y-4">
                  {records.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-4 rounded shadow border border-gray-200 cursor-pointer"
                      onClick={() => toggleExpand(t.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-lg capitalize">
                          {t.category}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {t.RecordedAt?.toDate?.().toLocaleDateString() || ""}
                        </span>
                      </div>

                      {expandedId === t.id && (
                        <div className="text-sm space-y-1 mt-2">
                          {Object.entries(t).map(([key, value]) => {
                            if (key === "RecordedAt") {
                              const date =
                                value?.toDate?.().toLocaleString() || "N/A";
                              return (
                                <p key={key}>
                                  <strong>{key}:</strong> {date}
                                </p>
                              );
                            } else {
                              return (
                                <p key={key}>
                                  <strong>{key}:</strong> {String(value)}
                                </p>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Transaction;
