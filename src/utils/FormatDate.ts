export default function formatDate(timestamp: any) {
  if (!timestamp?.toDate) return "N/A";
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
