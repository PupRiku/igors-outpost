"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { BASE_ARMORS } from "@/data/armorOptions";
import { ITEM_VARIANTS } from "@/data/itemOptions";
import VoidSelect from "./VoidSelect";
import { ShopItem } from "@/types/ShopItem";

// Types for your props
interface ItemData {
    Item: string;
    Type: string;
    Category: string;
    Rarity: string;
    'Cost (GP)': string | number;
    Notes?: string;
}

interface ItemCardProps {
    item: ShopItem;
    onAddToCart: (cartItem: any) => void;
}

export default function ItemCard({ item, onAddToCart }: ItemCardProps) {
    // --- STATE ---
    const [selectedVariant, setSelectedVariant] = useState<string>("");
    const [armorCostToAdd, setArmorCostToAdd] = useState<number>(0);
    const [isHovered, setIsHovered] = useState(false);

    // --- LOGIC DETECTORS ---
    const note = item.Notes || "";

    // 1. Is this a "Selector" item? (Ammo, Spells, Resistance)
    const isSelector = note.includes("Choose") || ITEM_VARIANTS[item.Item];
  
    // 2. Is this an "Armor Math" item? (Mithral, Mariner)
    const isArmorMath = note.includes("base armor cost") || note.includes("base metal armor cost");
    const isMithral = item.Item.includes("Mithral");

    // --- PRICE CALCULATION ---
    // Handle "Varies" or strings like "1,500"
    const basePrice = useMemo(() => {
        const costStr = item['Cost (GP)'].toString().replace(/,/g, '');
        const parsed = parseFloat(costStr);
        return isNaN(parsed) ? 0 : parsed;
    }, [item]);

    const finalPrice = basePrice + armorCostToAdd;
    const displayPrice = finalPrice > 0 ? finalPrice.toLocaleString() : "Varies";

    // --- ARMOR OPTIONS FILTER ---
    const armorOptions = useMemo(() => {
        if (!isArmorMath) return [];

        return BASE_ARMORS.filter(a => {
            // Rule 1: Shields are never valid for these specific enchantments
            if (a.type === "Shield") return false;

            // Rule 2: Mithral Specifics (Medium or Heavy, but NOT Hide)
            if (isMithral) {
                return (a.type === "Medium" || a.type === "Heavy") && a.name !== "Hide";
            }

            // Rule 3: Mariner's (applies to any armor that isn't a shield)
            // Since we already filtered shields above, we return true for everything else.
            return true;
        });
    }, [isArmorMath, isMithral]);

    // --- HANDLERS ---
    const handleArmorSelect = (armorName: string) => {
        const armor = BASE_ARMORS.find(a => a.name === armorName);
        if (armor) {
            setSelectedVariant(armor.name);
            setArmorCostToAdd(armor.cost);
        }
    };

    const handleVariantSelect = (variant: string) => {
        setSelectedVariant(variant);
    };

    const handleAddClick = () => {
        onAddToCart({
            ...item,
            finalPrice: finalPrice, // Send the calculated price
            variant: selectedVariant || null, // Send the chosen ammo/spell/armor type
            name: selectedVariant ? `${item.Item} (${selectedVariant})` : item.Item
        });
    
        // Optional: Reset state after adding
        setSelectedVariant("");
        setArmorCostToAdd(0);
    };

    // --- VALIDATION ---
    // User cannot add to cart if they haven't made a required choice
    const isValid = (!isSelector && !isArmorMath) || (selectedVariant !== "");

    return (
        <motion.div 
            className={clsx(
                "relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 group",
                // Styling based on Rarity
                item.Rarity === "Common" && "bg-slate-900/40 border-slate-700",
                item.Rarity === "Uncommon" && "bg-green-900/20 border-green-800/50 hover:border-green-500",
                item.Rarity === "Rare" && "bg-blue-900/20 border-blue-800/50 hover:border-blue-500",
                item.Rarity === "Very Rare" && "bg-purple-900/20 border-purple-800/50 hover:border-purple-500",
                item.Rarity === "Legendary" && "bg-amber-900/20 border-amber-500/50 hover:border-amber-400"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5, scale: 1.01 }}
        >
            {/* Rarity Tag */}
            <div className="absolute top-2 right-3 text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity font-sans">
                {item.Rarity}
            </div>

            {/* Item Name */}
            <h3 className="text-xl font-serif text-gray-100 mb-1 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">
                {item.Item}
            </h3>
            <p className="text-xs text-gray-500 mb-4 italic">{item.Category} • {item.Type}</p>

            {/* --- DYNAMIC INTERACTION AREA --- */}
            <div className="min-h-[60px] flex flex-col justify-end">
                
                {/* CASE A: Selector (Ammo, Spells, etc.) */}
                {isSelector && (
                    <VoidSelect 
                        label={item.Item.split(',')[0]} // "Ammunition" instead of "Ammunition, +1"
                        note={note}
                        options={ITEM_VARIANTS[item.Item]}
                        onSelect={handleVariantSelect}
                    />
                )}

                {/* CASE B: Armor Math Calculator */}
                {isArmorMath && (
                    <div className="mb-2 animate-in fade-in slide-in-from-bottom-2">
                        <label className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1">
                            Select Base Armor
                        </label>
                        <select 
                            className="w-full bg-black/80 border border-purple-800 text-gray-300 p-2 text-sm rounded focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none appearance-none cursor-pointer"
                            onChange={(e) => handleArmorSelect(e.target.value)}
                            value={selectedVariant}
                        >
                            <option value="" disabled>-- Choose Armor --</option>
                            {armorOptions.map(a => (
                                <option key={a.name} value={a.name}>
                                    {a.name} (+{a.cost} gp)
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* CASE C: Standard Description (if note exists but isn't interactive) */}
                {!isSelector && !isArmorMath && note && (
                    <p className="text-xs text-gray-400 italic border-l-2 border-purple-500/30 pl-2 mb-2">
                        "{note}"
                    </p>
                )}
            </div>

            {/* --- FOOTER: Price & Action --- */}
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                <div>
                    <span className="text-xs text-gray-500 block">Cost</span>
                    <span className={clsx(
                        "font-serif text-lg",
                        finalPrice === 0 ? "text-gray-400 italic" : "text-amber-400"
                    )}>
                        {displayPrice} <span className="text-xs text-gray-600">GP</span>
                    </span>
                </div>

                <button 
                    onClick={handleAddClick}
                    disabled={!isValid}
                    className={clsx(
                        "px-4 py-2 rounded text-sm font-semibold transition-all duration-300 shadow-lg",
                        isValid 
                            ? "bg-purple-900/80 hover:bg-cyan-900 hover:text-cyan-100 text-white shadow-purple-900/20 hover:shadow-cyan-500/50 border border-purple-500/30"
                            : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-transparent"
                    )}
                >
                    {isValid ? "Add to Stash" : "Select Option"}
                </button>
            </div>

            {/* Decorative Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
        </motion.div>
    );
}