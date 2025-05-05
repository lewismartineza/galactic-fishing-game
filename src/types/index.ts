export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface Fish {
  id: string;
  name: string;
  rarity: Rarity;
  xp: number;
  gold: number;
}

export interface CommandType {
  command: string;
  response: string;
  timestamp: string;
}

export interface CommandContext {
  inventory: Fish[];
  gold: number;
  xp: number;
  level: number;
  fishingCooldown: number;
  consecutiveFishing: number;
  setInventory: (value: Fish[] | ((prev: Fish[]) => Fish[])) => void;
  setGold: (value: number | ((prev: number) => number)) => void;
  setXp: (value: number | ((prev: number) => number)) => void;
  setLevel: (value: number | ((prev: number) => number)) => void;
  setFishingCooldown: (value: number | ((prev: number) => number)) => void;
  setConsecutiveFishing: (value: number | ((prev: number) => number)) => void;
}