import { useState } from "react";
import { UserNameForm } from "@/components/UserNameForm";
import { DatePicker } from "@/components/DatePicker";
import { TimeSlots, type TimeSlot } from "@/components/TimeSlots";
import { startOfToday, format, addDays } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from "firebase/firestore";

interface Booking {
  id: string;
  userName: string;
  date: string;
  time: string;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push({
        time,
        isAvailable: Math.random() > 0.3, // Simulate random availability
      });
    }
  }

  return slots;
};

const Index = () => {
  const [userName, setUserName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    setIsLoading(true);
    // In a real app, this would fetch slots from the backend
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedTime(time);
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedTime) return;
      
      const bookingData = {
        userName,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "bookings"), bookingData);
      
      toast.success(
        `Appointment booked for ${format(selectedDate, "MMMM d")} at ${format(
          new Date(`2000-01-01T${selectedTime}`),
          "h:mm a"
        )}`
      );
      
      setShowConfirmDialog(false);
      setSelectedTime(null);
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const handleCheckBooking = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userName", "==", userName));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const booking = querySnapshot.docs[0];
        setCurrentBooking({
          id: booking.id,
          ...booking.data() as Omit<Booking, "id">
        });
        setShowManageDialog(true);
      } else {
        toast.info("No current booking found.");
      }
    } catch (error) {
      toast.error("Failed to fetch booking details.");
    }
  };

  const handleCancelBooking = async () => {
    try {
      if (!currentBooking) return;
      
      await deleteDoc(doc(db, "bookings", currentBooking.id));
      toast.success("Booking cancelled successfully");
      setShowManageDialog(false);
      setCurrentBooking(null);
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UserNameForm onSubmit={setUserName} />
      </div>
    );
  }

  const maxDate = addDays(startOfToday(), 5);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Book an Appointment</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Welcome, {userName}</p>
            <button
              onClick={handleCheckBooking}
              className="text-primary hover:underline"
            >
              Check/Manage Booking
            </button>
          </div>
        </div>

        <div className="relative">
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            maxDays={5}
            onClick={() => setShowCalendar(!showCalendar)}
          />
          
          {showCalendar && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-10 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && handleDateSelect(date)}
                disabled={(date) =>
                  date < startOfToday() || date > maxDate
                }
                initialFocus
              />
            </Card>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <TimeSlots
            slots={generateTimeSlots(selectedDate)}
            onSlotSelect={handleSlotSelect}
            isLoading={isLoading}
          />
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Would you like to book an appointment for {format(selectedDate, "MMMM d")} at{" "}
                {selectedTime && format(new Date(`2000-01-01T${selectedTime}`), "h:mm a")}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmBooking}>
                Confirm Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showManageDialog} onOpenChange={setShowManageDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Manage Booking</AlertDialogTitle>
              <AlertDialogDescription>
                {currentBooking && (
                  <div className="space-y-2">
                    <p>Current booking details:</p>
                    <p>Date: {format(new Date(currentBooking.date), "MMMM d, yyyy")}</p>
                    <p>Time: {format(new Date(`2000-01-01T${currentBooking.time}`), "h:mm a")}</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;