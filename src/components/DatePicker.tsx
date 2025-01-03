import { Button } from "@/components/ui/button";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  maxDays?: number;
  onClick?: () => void;
}

export const DatePicker = ({ selectedDate, onDateSelect, maxDays = 5, onClick }: DatePickerProps) => {
  const today = startOfToday();
  const maxDate = addDays(today, maxDays - 1);

  const handlePrevDay = () => {
    const prevDay = addDays(selectedDate, -1);
    if (!isBefore(prevDay, today)) {
      onDateSelect(prevDay);
    }
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    if (isBefore(nextDay, addDays(maxDate, 1))) {
      onDateSelect(nextDay);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevDay}
        disabled={isBefore(addDays(selectedDate, -1), today)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={onClick}
        className="flex items-center gap-2"
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="text-lg font-semibold">
          {format(selectedDate, "EEEE, MMMM d")}
        </span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        disabled={!isBefore(selectedDate, maxDate)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};