export interface ShopItem {
  Item: string;
  Type: string;
  Category: string;
  Rarity: string;
  'Cost (GP)': string | number;
  Notes?: string;
}