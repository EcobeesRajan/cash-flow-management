import React from "react";

export type ItemWithRecordedAt = {
  recordedAt?: { toDate: () => Date } | null;
  [key: string]: | string | number | boolean | null | undefined | Date | { toDate: () => Date } | unknown[] | Record<string, unknown>;
};

type Column = {
  label: string;
};

export type GroupByDateProps<T extends ItemWithRecordedAt> = {
  items: T[];
  columns: Column[];
  rowRenderer: (item: T) => React.ReactNode;
};

export function groupByDate<T extends ItemWithRecordedAt>(data: T[]) {
  const groups: Record<string, T[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  data.forEach((t) => {
    const date = t.recordedAt?.toDate?.();
    if (!date) return;

    let label: string;
    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else
      label = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });

  return Object.entries(groups).sort((a, b) => {
    const aDate = a[1][0].recordedAt?.toDate?.() ?? new Date(0);
    const bDate = b[1][0].recordedAt?.toDate?.() ?? new Date(0);
    return bDate.getTime() - aDate.getTime();
  });
}

const GroupByDate = <T extends ItemWithRecordedAt>({
  items,
  columns,
  rowRenderer,
}: GroupByDateProps<T>) => {
  const grouped = groupByDate(items);

  return (
    <div className="space-y-6">
      {grouped.map(([dateLabel, records]) => (
        <div key={dateLabel}>
          <h3 className="text-lg font-semibold mb-2">{dateLabel}</h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="p-2 border bg-gray-100">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{records.map(rowRenderer)}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default GroupByDate;
