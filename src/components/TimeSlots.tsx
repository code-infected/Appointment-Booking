import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface TimeSlotsProps {
  slots: TimeSlot[];
  onSlotSelect: (time: string) => void;
  isLoading?: boolean;
}

export const TimeSlots = ({ slots, onSlotSelect, isLoading = false }: TimeSlotsProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 animate-fadeIn">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full max-w-sm mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-full max-w-sm mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-full max-w-sm mx-auto"></div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 animate-fadeIn">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 animate-fadeIn">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          variant={slot.isAvailable ? "outline" : "secondary"}
          disabled={!slot.isAvailable}
          onClick={() => slot.isAvailable && onSlotSelect(slot.time)}
          className="h-16"
        >
          {format(new Date(`2000-01-01T${slot.time}`), "h:mm a")}
        </Button>
      ))}
    </div>
  );
};