import { loadItems } from "@/lib/loadItems";
import ShopInterface from "@/components/ShopInterface";

export default async function Home() {
  const items = await loadItems();

  return (
    <ShopInterface initialItems={items} />
  );
}