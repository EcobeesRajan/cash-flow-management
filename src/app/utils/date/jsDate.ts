export default function toJSDate(timestamp?: { seconds: number; nanoseconds: number }): Date {
  if (!timestamp || typeof timestamp.seconds !== "number") return new Date(0); // fallback date
  return new Date(timestamp.seconds * 1000);
}
