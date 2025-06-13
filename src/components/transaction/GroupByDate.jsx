export const groupByDate = (data) => {
  const groups = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  data.forEach((t) => {
    if (!t.recordedAt?.toDate) return;
    const date = t.recordedAt.toDate();
    let label;

    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else {
      label = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });

  return Object.entries(groups).sort((a, b) => {
    const aDate = a[1][0].recordedAt.toDate();
    const bDate = b[1][0].recordedAt.toDate();
    return bDate - aDate;
  });
};

const GroupByDate = ({ items, columns, rowRenderer }) => {
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
