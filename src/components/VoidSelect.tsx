"use client";

import { useEffect, useRef, useState } from "react";
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

    // New State for "Custom Manual Entry"
    const [isCustom, setIsCustom] = useState(false);
    const customInputRef = useRef<HTMLInputElement>(null);

    const isSpell = note?.toLowerCase().includes('spell') || note?.toLowerCase().includes('cantrip');
    const { spells, loading } = useSpells(isSpell && note ? note : "");

    const activeList = isSpell ? spells : (options || []);

    // Filter based on user typing
    const filteredOptions = activeList.filter(opt => 
        opt.toLowerCase().includes(search.toLowerCase())
    );

    // Auto-focus the input when switching to custom mode
    useEffect(() => {
        if (isCustom && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [isCustom]);

    const handleCustomSubmit = () => {
        if (selected.trim()) {
            onSelect(selected); // Pass the custom value up to the cart logic
            setIsOpen(false);
            // We keep isCustom true so the UI shows the text input state
        }
    };

    return (
        <div className="relative w-full mb-4">
      
            {/* TRIGGER BUTTON (Or Custom Input if active) */}
            {!isCustom ? (
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-2 bg-black/50 border border-purple-900/50 text-cyan-100/80 font-serif text-left flex justify-between items-center hover:border-purple-500 hover:shadow-[0_0_10px_#8b5cf6] transition-all"
                >
                    <span className={selected ? "text-cyan-300" : "text-gray-400"}>
                        {selected || `Select ${label}...`}
                    </span>
                    <span className="text-purple-500 text-xs">▼</span>
                </button>
            ) : (
                <div className="flex w-full items-center gap-2 animate-in fade-in duration-300">
                    <input
                        ref={customInputRef}
                        type="text"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                        onBlur={handleCustomSubmit}
                        placeholder="Inscribe spell name..."
                        className="w-full p-2 bg-black/80 border border-cyan-500/50 text-cyan-300 font-serif focus:outline-none focus:shadow-[0_0_15px_#22d3ee]"
                    />
                    <button 
                        onClick={() => { setIsCustom(false); setSelected(""); setSearch(""); }}
                        className="text-red-400 hover:text-red-300 px-2 font-bold"
                        title="Cancel custom entry"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* DROPDOWN PANEL */}
            <AnimatePresence>
                {isOpen && !isCustom && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-purple-500/50 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
                >
                    {/* Sticky Search Bar */}
                    <div className="sticky top-0 bg-black p-2 border-b border-purple-900 z-10">
                    <input 
                        type="text"
                        placeholder="Search the void..."
                        className="w-full bg-gray-900 text-white p-1 text-sm border border-gray-700 focus:outline-none focus:border-cyan-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    </div>

                    {loading && <div className="p-4 text-center text-purple-400 animate-pulse text-sm">Summoning scrolls...</div>}

                    {/* Standard Options */}
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
                    
                    {/* THE CUSTOM FALLBACK: Shows when no results found */}
                    {(filteredOptions.length === 0 && !loading) && (
                    <div 
                        onClick={() => {
                        setIsOpen(false);
                        setIsCustom(true);
                        setSelected(search); // Pre-fill with what they typed so far
                        }}
                        className="p-3 text-sm text-cyan-500 italic hover:bg-purple-900/30 cursor-pointer border-t border-purple-900/30 flex items-center gap-2"
                    >
                        <span>✧</span> Inscribe "{search}" manually...
                    </div>
                    )}
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}