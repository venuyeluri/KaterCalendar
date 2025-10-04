import { OrderSummary } from "../OrderSummary";

export default function OrderSummaryExample() {
  const mockItems = [
    { id: "1", name: "Grilled Salmon", quantity: 2, price: 24.99 },
    { id: "2", name: "Caesar Salad", quantity: 1, price: 12.99 },
    { id: "3", name: "Chocolate Lava Cake", quantity: 3, price: 8.99 },
  ];

  return (
    <div className="max-w-md p-6">
      <OrderSummary 
        items={mockItems}
        onSubmit={() => console.log("Order submitted")}
      />
    </div>
  );
}
