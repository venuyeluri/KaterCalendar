import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  total: number;
  date: string;
  status: "pending" | "confirmed" | "completed";
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No orders yet
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
