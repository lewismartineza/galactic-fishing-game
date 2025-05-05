import { useEffect, useRef, useState, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Rarity, Fish, CommandType, CommandContext } from "../types/index";

const RARITIES: Rarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const FISH_TYPES = ["Trout", "Salmon", "Bass", "Tuna", "Shark", "Goldfish"];
const MAX_CONSECUTIVE_FISHING = 3;
const FISHING_COOLDOWN = 30;
const MESSAGE_COST = 100;
const LEVEL_UP_XP = 1000;

const commandHandlers = {
  help: {
    description: "Show available commands",
    execute: () => `
Available commands:
- /help: Show this message
- /fish: Go fishing
- /inventory: Show your fish inventory
- /eat <num>: Eat a fish to gain XP
- /sell <num|all>: Sell fish for gold
- /stats: Show your current stats
- /send-money <amount> <user>: Transfer gold
- /message <text>: Send global message (costs ${MESSAGE_COST} gold)
    `.trim()
  },

 fish: {
    description: "Go fishing",
    execute: (_: string[], ctx: CommandContext) => {
      if (ctx.fishingCooldown > 0) {
        return `⏳ Wait ${ctx.fishingCooldown}s before fishing again`;
      }

      if (ctx.consecutiveFishing >= MAX_CONSECUTIVE_FISHING) {
        ctx.setFishingCooldown(FISHING_COOLDOWN);
        return "🛑 You've fished too much! Wait 30 seconds to fish again";
      }

      const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];
      const type = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
      const rarityMultiplier = RARITIES.indexOf(rarity) + 1;

      const newFish: Fish = {
        id: `fish-${Date.now()}`,
        name: `${rarity} ${type}`,
        rarity,
        xp: Math.floor(rarityMultiplier * 15 * (Math.random() + 0.5)),
        gold: Math.floor(rarityMultiplier * 10 * (Math.random() + 0.5))
      };

      ctx.setInventory(prev => [...prev, newFish]);
      ctx.setConsecutiveFishing(prev => prev + 1);

      if (ctx.consecutiveFishing + 1 >= MAX_CONSECUTIVE_FISHING) {
        ctx.setFishingCooldown(FISHING_COOLDOWN);
      }

      return `🎣 Caught ${newFish.name}! (XP: +${newFish.xp} | Gold: +${newFish.gold})`;
    }
  },

  inventory: {
    description: "Show your fish inventory",
    execute: (_: string[], ctx: CommandContext) => {
      if (ctx.inventory.length === 0) return "Your inventory is empty";
      return ctx.inventory.map((fish, i) => 
        `${i+1}. ${fish.name} (${fish.rarity}) - XP: ${fish.xp} | Gold: ${fish.gold}`
      ).join("\n");
    }
  },

  eat: {
    description: "Eat a fish to gain XP",
    execute: (args: string[], ctx: CommandContext) => {
      const index = Number(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= ctx.inventory.length) {
        return "Usage: /eat <fish-number> (see /inventory)";
      }
      const fish = ctx.inventory[index];
      ctx.setInventory(prev => prev.filter((_, i) => i !== index));
      
      const newXp = ctx.xp + fish.xp;
      const newLevel = Math.floor(newXp / LEVEL_UP_XP) + 1;
      if (newLevel > ctx.level) {
        ctx.setLevel(newLevel);
      }
      ctx.setXp(newXp);
      
      return `🍴 Ate ${fish.name} and gained ${fish.xp} XP!`;
    }
  },

  sell: {
    description: "Sell fish for gold",
    execute: (args: string[], ctx: CommandContext) => {
      if (args[0] === "all") {
        if (ctx.inventory.length === 0) return "Nothing to sell";
        const total = ctx.inventory.reduce((sum, fish) => sum + fish.gold, 0);
        ctx.setInventory([]);
        ctx.setGold(prev => prev + total);
        return `💰 Sold all fish for ${total} gold!`;
      }
      const index = Number(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= ctx.inventory.length) {
        return "Usage: /sell <fish-number> or /sell all";
      }
      const fish = ctx.inventory[index];
      ctx.setInventory(prev => prev.filter((_, i) => i !== index));
      ctx.setGold(prev => prev + fish.gold);
      return `💰 Sold ${fish.name} for ${fish.gold} gold!`;
    }
  },

  stats: {
    description: "Show your current stats",
    execute: (_: string[], ctx: CommandContext) => {
      return `
🧑 Player Stats:
Level: ${ctx.level}
XP: ${ctx.xp}/${LEVEL_UP_XP * ctx.level}
Gold: ${ctx.gold}
Inventory: ${ctx.inventory.length} fish
Fishing Cooldown: ${ctx.fishingCooldown}s
      `.trim();
    }
  },
  "send-money": {
    description: "Transfer gold to another player",
    execute: (args: string[], ctx: CommandContext) => {
      const [amountStr, user] = args;
      const amount = Number(amountStr);
      if (!user || isNaN(amount)) return "Usage: /send-money <amount> <user>";
      if (amount <= 0) return "Amount must be positive";
      if (amount > ctx.gold) return "Not enough gold";
      ctx.setGold(prev => prev - amount);
      return `💸 Sent ${amount} gold to ${user}`;
    }
  },

  message: {
    description: "Send global message",
    cost: MESSAGE_COST,
    execute: (args: string[], ctx: CommandContext) => {
      if (ctx.gold < MESSAGE_COST) return `You need ${MESSAGE_COST} gold to send messages`;
      const message = args.join(" ");
      if (!message) return "Message cannot be empty";
      ctx.setGold(prev => prev - MESSAGE_COST);
      return `📢 Message sent: "${message}" (Cost: ${MESSAGE_COST} gold)`;
    }
  }
};

export function useCommandConsole() {
  const [inventory, setInventory] = useLocalStorage<Fish[]>("inventory", []);
  const [gold, setGold] = useLocalStorage("gold", 0);
  const [xp, setXp] = useLocalStorage("xp", 0);
  const [level, setLevel] = useLocalStorage("level", 1);
  const [fishingCooldown, setFishingCooldown] = useState(0);
  const [consecutiveFishing, setConsecutiveFishing] = useState(0);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandType[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fishingCooldown > 0) {
      const timer = setTimeout(() => {
        setFishingCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (consecutiveFishing >= MAX_CONSECUTIVE_FISHING) {
      setConsecutiveFishing(0);
    }
  }, [fishingCooldown, consecutiveFishing]);

  const commandContext: CommandContext = {
    inventory,
    gold,
    xp,
    level,
    fishingCooldown,
    consecutiveFishing,
    setInventory,
    setGold,
    setXp,
    setLevel,
    setFishingCooldown,
    setConsecutiveFishing
  };

  const processCommand = useCallback((rawInput: string): string => {
    const [cmd, ...args] = rawInput.trim().split(" ");
    if (!cmd.startsWith("/")) return "❌ Commands must start with /";
    
    const commandName = cmd.slice(1).toLowerCase() as keyof typeof commandHandlers;
    const handler = commandHandlers[commandName];
    
    if (!handler) return `❌ Unknown command. Type /help for available commands`;
    if ("cost" in handler && gold < handler.cost) return `❌ Need ${handler.cost} gold to use this command`;
    
    try {
      return handler.execute(args, commandContext);
    } catch (error) {
      return `❌ Error executing command: ${error instanceof Error ? error.message : String(error)}`;
    }
  }, [gold, commandContext]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const command = input.trim();
    const response = processCommand(command);
    
    setCommandHistory(prev => [...prev, {
      command,
      response,
      timestamp: new Date().toISOString()
    }]);
    
    setInput("");
  }, [input, processCommand]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return {
    commandHistory,
    handleSubmit,
    input,
    setInput,
    scrollAreaRef,
    fishingCooldown,
    isInventoryLoaded: true,
    money: gold,
    xp,
    level,
    inventory
  };
}