import { useState, useEffect } from "react";

// Helper to convert "1st level" to API integer
const parseLevel = (note: string): number | null => {
    if (note.toLowerCase().includes('cantrip')) return 0;
    const match = note.match(/(\d+)/);
    return match ? parseInt(match[0]) : null;
}

export const useSpells = (note: string) => {
    const [spells, setSpells] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSpells = async () => {
            const level = parseLevel(note);
            if (level === null) return;

            setLoading(true);
            try {
                // Fetch from the standard D&D 5e API
                const response = await fetch(`https://www.dnd5api.co/api/2014/spells?level=${level}`);
                const data = await response.json();
                // The API returns objects { index, name, url }. We just want names.
                setSpells(data.results.map((s: any) => s.name));
            } catch (e) {
                console.error("Failed to summon spells:", e);
            } finally {
                setLoading(false);
            }
        };

        if (note) fetchSpells();
    }, [note]);

    return { spells, loading };
}