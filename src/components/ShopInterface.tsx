"use client";

import { useState, useMemo } from 'react';
import ItemCard from './ItemCard';

// Define the shape of your item based on the CSV
interface ShopItem {
  Item: string;
  Type: string;
  Category: string;
  Rarity: string;
  'Cost (GP)': string | number;
  Notes?: string;
}

export default function ShopInterface({ initialItems }: { initialItems: ShopItem[] }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get unique categories for the filter tabs
  const categories = ["All", ...Array.from(new Set(initialItems.map(i => i.Category).filter(Boolean)))];

  // --- FILTERING & SORTING LOGIC ---
  const filteredItems = useMemo(() => {
    return initialItems
      .filter(item => {
        // Search Filter (checks Name or Notes)
        const matchesSearch = 
          item.Item.toLowerCase().includes(search.toLowerCase()) || 
          item.Notes?.toLowerCase().includes(search.toLowerCase());
        
        // Category Filter
        const matchesCategory = selectedCategory === "All" || item.Category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Helper to parse cost safely
        const getCost = (val: string | number) => {
          if (val === "Varies") return sortOrder === "asc" ? 999999 : -1;
          const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
          return isNaN(num) ? 0 : num;
        };

        const costA = getCost(a['Cost (GP)']);
        const costB = getCost(b['Cost (GP)']);

        return sortOrder === "asc" ? costA - costB : costB - costA;
      });
  }, [initialItems, search, selectedCategory, sortOrder]);

  // --- CART HANDLER ---
  const addToCart = (newItem: any) => {
    console.log("Added to Stash:", newItem);
    setCart(prev => [...prev, newItem]);
    // Optional: Add a toast notification here later
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-50 font-sans selection:bg-purple-500/30">
      
      {/* HERO / SUMMONING SECTION */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-purple-900/30 pb-6 pt-8 px-4 md:px-10 shadow-[0_10px_40px_-10px_rgba(88,28,135,0.2)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 mb-4 tracking-tighter">
              Igor's Outpost
            </h1>
            
            {/* THE SUMMONING INPUT */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Summon item from the void..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/50 border border-purple-800/50 rounded-lg p-4 pl-12 text-lg text-cyan-100 placeholder:text-purple-700/50 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-xl">
                ✦
              </span>
            </div>
          </div>

          {/* STASH COUNTER (Mini Cart) */}
          <div className="w-full md:w-auto">
             <div className="border border-purple-500/30 bg-purple-900/10 rounded-lg p-3 flex items-center justify-between gap-4">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-purple-400">Geas Contract</div>
                  <div className="font-serif text-xl text-amber-400">
                    {cart.reduce((sum, i) => sum + (i.finalPrice || 0), 0).toLocaleString()} GP
                  </div>
                </div>
                <div className="bg-purple-900/50 w-10 h-10 rounded-full flex items-center justify-center border border-purple-500 text-cyan-300 font-bold">
                  {cart.length}
                </div>
             </div>
          </div>
        </div>

        {/* FILTERS BAR */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  selectedCategory === cat 
                    ? "bg-cyan-900/30 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                    : "border-purple-900/50 text-gray-500 hover:text-purple-300 hover:border-purple-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="ml-auto flex items-center gap-2 text-gray-500">
            <span>Sort Cost:</span>
            <button onClick={() => setSortOrder("asc")} className={sortOrder === "asc" ? "text-cyan-400 font-bold" : "hover:text-white"}>Low</button>
            <span>/</span>
            <button onClick={() => setSortOrder("desc")} className={sortOrder === "desc" ? "text-cyan-400 font-bold" : "hover:text-white"}>High</button>
          </div>
        </div>
      </header>

      {/* GRID SECTION */}
      <main className="max-w-7xl mx-auto p-4 md:p-10">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-600 italic">
            "The void yields nothing matching that description..."
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <ItemCard 
                key={`${item.Item}-${index}`} 
                item={item} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}