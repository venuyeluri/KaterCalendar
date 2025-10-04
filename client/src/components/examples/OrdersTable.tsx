import { OrdersTable } from "../OrdersTable";

export default function OrdersTableExample() {
  const mockOrders = [
    {
      id: "1",
      customerName: "John Smith",
      items: [
        { name: "Grilled Salmon", quantity: 2 },
        { name: "Caesar Salad", quantity: 1 },
      ],
      total: 62.97,
      date: "Oct 10, 2025",
      status: "confirmed" as const,
    },
    {
      id: "2",
      customerName: "Sarah Johnson",
      items: [
        { name: "Pasta Primavera", quantity: 3 },
      ],
      total: 44.97,
      date: "Oct 10, 2025",
      status: "pending" as const,
    },
    {
      id: "3",
      customerName: "Mike Davis",
      items: [
        { name: "Chocolate Lava Cake", quantity: 4 },
        { name: "Grilled Salmon", quantity: 1 },
      ],
      total: 60.95,
      date: "Oct 9, 2025",
      status: "completed" as const,
    },
  ];

  return (
    <div className="p-6">
      <OrdersTable orders={mockOrders} />
    </div>
  );
}
