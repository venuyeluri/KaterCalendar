import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarDate {
  date: Date;
  hasMenu: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
  menuDates?: Date[];
}

export function CalendarView({ onDateSelect, menuDates = [] }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date): CalendarDate[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDate[] = [];
    
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      const paddingDate = new Date(year, month, -startPadding + i + 1);
      days.push({
        date: paddingDate,
        hasMenu: false,
        isToday: false,
        isSelected: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      const isToday = currentDate.getTime() === today.getTime();
      const hasMenu = menuDates.some(
        (menuDate) => {
          const md = new Date(menuDate);
          md.setHours(0, 0, 0, 0);
          return md.getTime() === currentDate.getTime();
        }
      );
      const isSelected = selectedDate?.getTime() === currentDate.getTime();

      days.push({
        date: currentDate,
        hasMenu,
        isToday,
        isSelected,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (calendarDate: CalendarDate) => {
    if (calendarDate.date.getMonth() === currentMonth.getMonth()) {
      setSelectedDate(calendarDate.date);
      onDateSelect?.(calendarDate.date);
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{monthName}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            data-testid="button-next-month"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((calendarDate, index) => {
          const isCurrentMonth = calendarDate.date.getMonth() === currentMonth.getMonth();
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(calendarDate)}
              data-testid={`calendar-date-${calendarDate.date.getDate()}`}
              className={`
                relative min-h-20 p-2 rounded-lg border transition-all
                ${isCurrentMonth ? "hover-elevate active-elevate-2" : "opacity-40"}
                ${calendarDate.isSelected ? "bg-primary text-primary-foreground border-primary-border" : "border-border"}
                ${calendarDate.isToday && !calendarDate.isSelected ? "border-primary" : ""}
              `}
            >
              <span className="text-sm font-medium">{calendarDate.date.getDate()}</span>
              {calendarDate.hasMenu && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Menu available</span>
        </div>
      </div>
    </div>
  );
}
