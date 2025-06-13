import GroupByDate from "../transaction/GroupByDate";

const MenuTable = ({ items }) => {
  const columns = [
    { label: "Name" },
    { label: "Category" },
    { label: "Price" },
    { label: "Unit" },
    { label: "Quantity" },
    { label: "Added By" },
    { label: "Recorded At" },
  ];

  const renderRow = (item) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="p-2 border">{item.name}</td>
      <td className="p-2 border">{item.type}</td>
      <td className="p-2 border">Rs. {item.price}</td>
      <td className="p-2 border">{item.unit}</td>
      <td className="p-2 border">{item.quantity}</td>
      <td className="p-2 border">{item.username || "—"}</td>
      <td className="p-2 border">
        {item.recordedAt?.toDate
          ? item.recordedAt.toDate().toLocaleString()
          : "—"}
      </td>
    </tr>
  );

  return (
    <GroupByDate
      items={items}
      columns={columns}
      rowRenderer={renderRow}
    />
  );
};

export default MenuTable;
