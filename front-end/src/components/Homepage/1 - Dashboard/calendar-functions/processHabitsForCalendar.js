import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";

export const processHabitsForCalendarLogic = (
  userHabits,
  dateToProcess,
  setProcessedHabitDataByDate
) => {
  if (!userHabits || userHabits.length === 0) {
    setProcessedHabitDataByDate(new Map());
    return;
  }

  const habitsMap = new Map();

  const startOfCalendarView = new Date(
    dateToProcess.getFullYear(),
    dateToProcess.getMonth(),
    1
  );

  const endOfCalendarView = new Date(
    dateToProcess.getFullYear(),
    dateToProcess.getMonth() + 1,
    0
  );

  let startDayOfWeek = startOfCalendarView.getDay();
  let endDayOfWeek = endOfCalendarView.getDay();

  const displayStartDate = new Date(startOfCalendarView);
  displayStartDate.setDate(startOfCalendarView.getDate() - startDayOfWeek);

  const displayEndDate = new Date(endOfCalendarView);
  displayEndDate.setDate(endOfCalendarView.getDate() + (6 - endDayOfWeek));

  let currentDate = new Date(displayStartDate);
  while (currentDate <= displayEndDate) {
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const dayOfWeek = currentDate.getDay().toString();
    const dayOfMonth = currentDate.getDate();
    const monthOfYear = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    userHabits.forEach((habit) => {
      const habitStartDate = parseISO(habit.start_date);
      const habitEndDate = habit.end_date ? parseISO(habit.end_date) : null;

      const isDateWithinActivePeriod = isWithinInterval(currentDate, {
        start: startOfDay(habitStartDate),
        end: habitEndDate
          ? endOfDay(habitEndDate)
          : endOfDay(new Date(9999, 11, 31)),
      });

      if (!isDateWithinActivePeriod) {
        return;
      }

      let isRelevant = false;
      switch (habit.habit_frequency) {
        case "Daily":
          isRelevant = true;
          break;
        case "Weekly":
          isRelevant = habit.days_of_week_to_complete.includes(dayOfWeek);
          break;
        case "Monthly": {
          isRelevant = habit.day_of_month_to_complete === dayOfMonth;
          const startMonthTotal =
            habitStartDate.getFullYear() * 12 + habitStartDate.getMonth();
          const currentMonthTotal = year * 12 + monthOfYear - 1;
          isRelevant =
            isRelevant && (currentMonthTotal - startMonthTotal) % 1 === 0;
          break;
        }
        case "Yearly": {
          isRelevant =
            habit.yearly_month_of_year_to_complete === monthOfYear &&
            habit.yearly_day_of_year_to_complete === dayOfMonth;
          isRelevant =
            isRelevant &&
            year >= habitStartDate.getFullYear() &&
            (year - habitStartDate.getFullYear()) % 1 === 0;
          break;
        }
        default:
          isRelevant = false;
      }

      if (isRelevant) {
        if (!habitsMap.has(formattedDate)) {
          habitsMap.set(formattedDate, []);
        }
        habitsMap.get(formattedDate).push({
          ...habit,
          _relevantDate: currentDate,
        });
      }
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  setProcessedHabitDataByDate(habitsMap);
};
