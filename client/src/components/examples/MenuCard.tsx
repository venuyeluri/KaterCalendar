import { useState } from "react";
import { MenuCard } from "../MenuCard";
import salmonImage from "@assets/generated_images/Grilled_salmon_menu_item_6b384824.png";

export default function MenuCardExample() {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="max-w-md p-6">
      <MenuCard
        id="salmon-1"
        name="Grilled Salmon"
        description="Fresh Atlantic salmon with roasted vegetables and lemon butter sauce"
        price={24.99}
        image={salmonImage}
        dietary={["Gluten-free"]}
        quantity={quantity}
        onQuantityChange={(id, qty) => {
          console.log(`Updated ${id} to ${qty}`);
          setQuantity(qty);
        }}
      />
    </div>
  );
}
