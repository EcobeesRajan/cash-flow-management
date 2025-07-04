type Props = {
  title: string;
  value: string | number;
  color?: "red" | "blue" | "orange" | "green" | "gray";
};

const colorMap: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  gray: "bg-gray-400",
};

const SummaryCard = ({ title, value, color = "gray" }: Props) => (
  <div className={`p-4 rounded-lg shadow-md text-white ${colorMap[color]}`}>
    <h4 className="text-md">{title}</h4>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default SummaryCard;
