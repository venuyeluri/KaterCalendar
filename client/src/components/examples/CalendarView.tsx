import { CalendarView } from "../CalendarView";

export default function CalendarViewExample() {
  const today = new Date();
  const menuDates = [
    new Date(today.getFullYear(), today.getMonth(), 15),
    new Date(today.getFullYear(), today.getMonth(), 18),
    new Date(today.getFullYear(), today.getMonth(), 22),
    new Date(today.getFullYear(), today.getMonth(), 25),
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CalendarView 
        menuDates={menuDates}
        onDateSelect={(date) => console.log("Selected date:", date)}
      />
    </div>
  );
}
