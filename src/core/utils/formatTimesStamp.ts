export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
