import { useEffect, useRef, useState, useCallback } from "react";
import type { CommandType } from "../types/console";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Fish {
  id: string;
  name: string;
  rarity: Rarity;
  xp: number;
  gold: number;
}

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

interface CommandHandler {
  description: string;
  execute: (args: string[], context: CommandContext) => string;
  cooldown?: number;
  cost?: number;
}

interface CommandContext {
  inventory: Fish[];
  gold: number;
  xp: number;
  fishingCooldown: number;
  consecutiveFishing: number;
  setInventory: (value: Fish[] | ((prev: Fish[]) => Fish[])) => void;
  setGold: (value: number | ((prev: number) => number)) => void;
  setXp: (value: number | ((prev: number) => number)) => void;
  setFishingCooldown: (value: number | ((prev: number) => number)) => void;
  setConsecutiveFishing: (value: number | ((prev: number) => number)) => void;
}

const RARITIES: Rarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const FISH_TYPES = ["Trout", "Salmon", "Bass", "Tuna", "Shark", "Goldfish"];
const MAX_CONSECUTIVE_FISHING = 3;
const FISHING_COOLDOWN = 30;
const MESSAGE_COST = 100;

export function useCommandConsole() {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandType[]>([]);
  const [inventory, setInventory] = useLocalStorage<Fish[]>("inventory", []);
  const [gold, setGold] = useLocalStorage("gold", 0);
  const [xp, setXp] = useLocalStorage("xp", 0);
  const [fishingCooldown, setFishingCooldown] = useState(0);
  const [consecutiveFishing, setConsecutiveFishing] = useState(0);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fishingCooldown > 0) {
      const timer = setTimeout(() => {
        setFishingCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fishingCooldown]);

  useEffect(() => {
    setCommandHistory([{
      command: "system",
      response: "Welcome to the game! Type /help to see available commands.",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const commandContext: CommandContext = {
    inventory,
    gold,
    xp,
    fishingCooldown,
    consecutiveFishing,
    setInventory: setInventory as (value: Fish[] | ((prev: Fish[]) => Fish[])) => void,
    setGold: setGold as (value: number | ((prev: number) => number)) => void,
    setXp: setXp as (value: number | ((prev: number) => number)) => void,
    setFishingCooldown,
    setConsecutiveFishing,
  };

const commandHandlers: Record<string, CommandHandler> = {
  help: {
    description: "Show available commands",
    execute: () => {
      return `Available commands:\n${
        Object.entries(commandHandlers)
          .map(([cmd, { description }]) => `- /${cmd}: ${description}`)
          .join("\n")
      }`;
    },
  },

  fish: {
  description: "Go fishing",
  execute: (args: string[], context: CommandContext) => {
    const {
      setFishingCooldown,
      setConsecutiveFishing,
      fishingCooldown,
      consecutiveFishing,
      setInventory
    } = context;

    if (fishingCooldown > 0) {
      return `Wait ${fishingCooldown}s before fishing again.`;
    }

    if (consecutiveFishing >= MAX_CONSECUTIVE_FISHING) {
      setFishingCooldown(FISHING_COOLDOWN);
      setConsecutiveFishing(0);
      return "You've fished too much. Wait 30s to continue.";
    }

    const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];
    const type = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    const rarityIndex = RARITIES.indexOf(rarity);

    const xpGained = Math.floor((rarityIndex + 1) * 10 * (Math.random() + 0.5));
    const goldGained = Math.floor((rarityIndex + 1) * 5 * (Math.random() + 0.5));

    const newFish: Fish = {
      id: `fish-${Date.now()}`,
      name: `${rarity} ${type}`,
      rarity,
      xp: xpGained,
      gold: goldGained,
    };

    setInventory((prev: Fish[]) => [...prev, newFish]);
    setConsecutiveFishing((prev: number) => prev + 1);

    return `You caught a ${rarity} ${type}! (XP: ${xpGained}, Gold: ${goldGained})`;
  },
},

  inventory: {
    description: "Show your inventory",
    execute: (_args: string[], { inventory }: CommandContext) => {
      if (inventory.length === 0) return "Your inventory is empty.";

      const inventoryList = inventory
        .map((fish, i) => `${i + 1}. ${fish.name} - XP: ${fish.xp}, Gold: ${fish.gold}`)
        .join("\n");

      return `Inventory (${inventory.length} items):\n${inventoryList}`;
    },
  },

  eat: {
    description: "Eat a fish from your inventory",
    execute: (args, { inventory, setInventory, setXp }) => {
      const index = Number(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= inventory.length) {
        return "Invalid fish selection. Usage: /eat <fish-number>";
      }

      const fish = inventory[index];
      setInventory(inventory.filter((_, i) => i !== index));
      setXp((prev: number) => prev + fish.xp);

      return `You ate the ${fish.name} and gained ${fish.xp} XP!`;
    },
  },

  sell: {
    description: "Sell fish from your inventory",
    execute: (args, { inventory, setInventory, gold, setGold }) => {
      if (args[0] === "all") {
        if (inventory.length === 0) return "Your inventory is empty.";
        
        const totalGold = inventory.reduce((sum: number, fish: Fish) => sum + fish.gold, 0);
        setInventory([]);
        setGold((prev: number) => prev + totalGold);

        return `Sold all fish for ${totalGold} gold!`;
      }

      const index = Number(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= inventory.length) {
        return "Invalid fish selection. Usage: /sell <fish-number> or /sell all";
      }

      const fish = inventory[index];
      setInventory(inventory.filter((_, i) => i !== index));
      setGold((prev: number) => prev + fish.gold);

      return `Sold ${fish.name} for ${fish.gold} gold!`;
    },
  },

  market: {
    description: "View the market",
    execute: () => "Use the Market tab to view available items!",
  },

  "send-money": {
    description: "Send money to another player",
    execute: (args, { gold, setGold }) => {
      const [amount, user] = args;
      const goldAmount = Number(amount);

      if (!user || isNaN(goldAmount)) {
        return "Usage: /send-money <amount> <user>";
      }

      if (goldAmount <= 0) {
        return "Amount must be positive.";
      }

      if (goldAmount > gold) {
        return "Not enough gold.";
      }

      setGold((prev: number) => prev - goldAmount);
      return `Sent ${goldAmount} gold to ${user}!`;
    },
  },

  message: {
    description: "Send a message (costs 100 gold)",
    cost: MESSAGE_COST,
    execute: (args, { gold, setGold }) => {
      const message = args.join(" ");
      if (!message) return "Message cannot be empty.";

      if (gold < MESSAGE_COST) {
        return `Not enough gold to send a message (${MESSAGE_COST} required).`;
      }

      setGold((prev: number) => prev - MESSAGE_COST);
      return `Message sent: "${message}" (Cost: ${MESSAGE_COST} gold)`;
    },
  },

  stats: {
    description: "Show your stats",
    execute: (_args: string[], { gold, xp, inventory }: CommandContext) => {
      return `Gold: ${gold}\nXP: ${xp}\nInventory items: ${inventory.length}`;
    },
  },
};

  const processCommand = useCallback((command: string): string => {
    const [cmd, ...args] = command.trim().split(" ");
    const normalizedCmd = cmd.toLowerCase().replace("/", "");

    const handler = commandHandlers[normalizedCmd];
    if (!handler) {
      return `Unknown command: ${cmd}. Type /help for available commands.`;
    }

    if (handler.cost && gold < handler.cost) {
      return `Not enough gold to execute this command (${handler.cost} required).`;
    }

    try {
      return handler.execute(args, commandContext);
    } catch (error) {
      console.error("Error executing command:", error);
      return `An error occurred while executing the command: ${(error as Error).message}`;
    }
  }, [commandHandlers, commandContext, gold]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const command = input.trim();
      setInput("");

      const newCommand: CommandType = {
        command,
        response: processCommand(command),
        timestamp: new Date().toISOString(),
      };

      setCommandHistory((prev) => [...prev, newCommand]);
    },
    [input, processCommand]
  );

  return {
    commandHistory,
    handleSubmit,
    input,
    setInput,
    scrollAreaRef,
    fishingCooldown,
    gold,
    xp,
    inventory,
  };
}