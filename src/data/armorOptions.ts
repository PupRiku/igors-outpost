export type ArmorType = 'Light' | 'Medium' | 'Heavy' | 'Shield';

interface BaseArmor {
    name: string;
    cost: number;
    type: ArmorType;
    metal: boolean; // Useful for Mithral filtering
}

export const BASE_ARMORS: BaseArmor[] = [
    { name: "Padded", cost: 5, type: "Light", metal: false },
    { name: "Leather", cost: 10, type: "Light", metal: false },
    { name: "Studded Leather", cost: 45, type: "Light", metal: false },
    { name: "Hide", cost: 10, type: "Medium", metal: false },
    { name: "Chain Shirt", cost: 50, type: "Medium", metal: true },
    { name: "Scale Mail", cost: 50, type: "Medium", metal: true },
    { name: "Breastplate", cost: 400, type: "Medium", metal: true },
    { name: "Half Plate", cost: 750, type: "Medium", metal: true },
    { name: "Ring Mail", cost: 30, type: "Heavy", metal: true },
    { name: "Chain Mail", cost: 75, type: "Heavy", metal: true },
    { name: "Splint", cost: 200, type: "Heavy", metal: true },
    { name: "Plate", cost: 1500, type: "Heavy", metal: true },
    { name: "Shield", cost: 10, type: "Shield", metal: true },
]