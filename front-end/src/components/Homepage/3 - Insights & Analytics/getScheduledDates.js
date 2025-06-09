import { eachDayOfInterval, format, parseISO } from "date-fns";

export const getScheduledDates = (habit) => {
  const start = parseISO(habit.start_date);
  const end = habit.end_date ? parseISO(habit.end_date) : new Date();

  const allDays = eachDayOfInterval({ start, end });
  const result = [];

  for (let day of allDays) {
    const dayOfWeek = day.getDay().toString();
    const dayOfMonth = day.getDate();
    const month = day.getMonth() + 1;
    const year = day.getFullYear();

    let isRelevant = false;

    switch (habit.habit_frequency) {
      case "Daily":
        isRelevant = true;
        break;
      case "Weekly":
        isRelevant = habit.days_of_week_to_complete.includes(dayOfWeek);
        break;
      case "Monthly":
        isRelevant = habit.day_of_month_to_complete === dayOfMonth;
        break;
      case "Yearly":
        isRelevant =
          habit.yearly_month_of_year_to_complete === month &&
          habit.yearly_day_of_year_to_complete === dayOfMonth;
        break;
    }

    if (isRelevant) {
      result.push(format(day, "yyyy-MM-dd"));
    }
  }

  return result;
};
