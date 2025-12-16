import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { ShopItem } from '@/types/ShopItem';

export async function loadItems(): Promise<ShopItem[]> {
    const filePath = path.join(process.cwd(), 'src', 'data', "Igor's Shop - Sheet1.csv");
  
    const fileContent = fs.readFileSync(filePath, 'utf8');
  
    const { data } = Papa.parse<ShopItem>(fileContent, { // Generic tells Papa what to expect
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });

  return data;
}