export function formatDate(iso?: string) {
  if (!iso) return "TBD";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeRange(start?: string, end?: string) {
  if (!start || !end) return "TBD";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${fmt.format(startDate)} – ${fmt.format(endDate)}`;
}

export function formatRelative(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1) return `${diffDays} days ago`;
  return "Upcoming";
}
