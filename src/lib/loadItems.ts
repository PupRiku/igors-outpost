import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function loadItems() {
    // Construct path to your file in src/data
    const filePath = path.join(process.cwd(), 'src', 'data', "Igor's Shop - Sheet1.csv");

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const { data } = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true // Automatically converts numbers
    });

    return data;
}