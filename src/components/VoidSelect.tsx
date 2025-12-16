"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpells } from "@/hooks/useSpells";

interface VoidSelectProps {
    label: string;
    note?: string; // e.g. "Choose 1st level spell"
    options?: string[]; // For static lists like ammo
    onSelect: (value: string) => void;
}

export default function VoidSelect({ label, note, options, onSelect }: VoidSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");

    // If we have a note like "Choose spell", fetch dynamic spells.
    // Otherwise use the static options passed in (like for Ammo).
    const isSpell = note?.toLowerCase().includes('spell') || note?.toLowerCase().includes('cantrip');
    const { spells, loading } = useSpells(isSpell && note ? note : "");

    const activeList = isSpell ? spells : (options || []);

    // Filter based on user typing
    const filteredOptions = activeList.filter(opt => 
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full mb-4">
            {/* The Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 bg-black/50 border border-purple-900/50 text-cyan-100/80 font-serif text-left flex justify-between items-center hover:border-purple-500 hover:shadow-[0_0_10px_#8b5cf6]"
            >
                <span>{selected || `Select ${label}...`}</span>
                <span className="text-purple-500 text-xs">▼</span>
            </button>

            {/* The Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-purple-500/50 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {/* Search Input (sticky top) */}
                        <div className="sticky top-0 bg-black p-2 border-b border-purple-900">
                            <input 
                                type="text"
                                placeholder="Search the void..."
                                className="w-full bg-gray-900 text-white p-1 text-sm border border-gray-700 focus:outline-none focus:border-cyan-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Loading State */}
                        {loading && <div className="p-4 text-center text-purple-400 animate-pulse">Summoning scrolls...</div>}

                        {/* Options List */}
                        {filteredOptions.map((opt) => (
                            <div 
                                key={opt}
                                onClick={() => {
                                    setSelected(opt);
                                    onSelect(opt);
                                    setIsOpen(false);
                                }}
                                className="p-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-cyan-300 cursor-pointer transition-colors"
                            >
                                {opt}
                            </div>
                        ))}

                        {filteredOptions.length === 0 && !loading && (
                            <div className="p-2 text-gray-600 text-sm text-center">Nothing found in the void.</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}