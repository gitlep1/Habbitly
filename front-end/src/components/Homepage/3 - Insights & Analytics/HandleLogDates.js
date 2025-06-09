import { parseISO, format } from "date-fns";

export const AggregateLogDates = (userHabits, view = "weekly") => {
  const dateCounts = new Map();

  userHabits.forEach((habit) => {
    if (!habit.log_dates || habit.log_dates.length === 0) return;

    habit.log_dates.forEach((logDate) => {
      const date = parseISO(logDate);
      let key = "";

      switch (view) {
        case "weekly":
          key = format(date, "EEE"); // ex: Mon
          break;
        case "monthly":
          key = format(date, "d"); // ex: 15
          break;
        case "yearly":
          key = format(date, "MMM"); // ex: Jan
          break;
        default:
          key = format(date, "yyyy-MM-dd"); // fallback full date
      }

      dateCounts.set(key, (dateCounts.get(key) || 0) + 1);
    });
  });

  // Fill in empty data points for consistency
  const labels =
    view === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : view === "monthly"
      ? Array.from({ length: 31 }, (_, i) => `${i + 1}`)
      : view === "yearly"
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : [];

  const data = labels.map((label) => dateCounts.get(label) || 0);

  return { labels, data };
};
