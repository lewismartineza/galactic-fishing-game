import { useEffect, useRef, useState } from "react"
import type { CommandType } from "../types/console"
import { useLocalStorage } from "../hooks/useLocalStorage"

export function useCommandConsole() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<CommandType[]>([])
  const [inventory, setInventory] = useLocalStorage<Fish[]>("inventory", [])
  const [gold, setGold] = useLocalStorage("gold", 0)
  const [xp, setXp] = useLocalStorage("xp", 0)
  const [fishingCooldown, setFishingCooldown] = useState(0)
  const [consecutiveFishing, setConsecutiveFishing] = useState(0)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fishingCooldown > 0) {
      const timer = setTimeout(() => {
        setFishingCooldown((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [fishingCooldown])

  useEffect(() => {
    setCommandHistory([
      {
        command: "system",
        response: "Welcome to the game! Type /help to see available commands.",
        timestamp: new Date(),
      },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const command = input.trim()
    setInput("")

    const newCommand: CommandType = {
      command,
      response: processCommand(command),
      timestamp: new Date(),
    }

    setCommandHistory((prev) => [...prev, newCommand])
  }

  const processCommand = (command: string): string => {
    const parts = command.split(" ")
    const mainCommand = parts[0].toLowerCase()

    switch (mainCommand) {
      case "/help":
        return `Available commands:\n- /fish\n- /inventory\n- /eat <fish>\n- /sell <fish> or /sell all\n- /market\n- /send-money <amount> <user>\n- /message <text>`

      case "/fish":
        return handleFishCommand()

      case "/inventory":
        return handleInventoryCommand()

      case "/eat":
        return handleEatCommand(parts[1])

      case "/sell":
        return handleSellCommand(parts.slice(1))

      case "/market":
        return "Use the Market tab to view available items!"

      case "/send-money":
        return handleSendMoneyCommand(parts[1], parts[2])

      case "/message":
        return handleMessageCommand(parts.slice(1).join(" "))

      default:
        return `Unknown command: ${command}. Type /help for available commands.`
    }
  }

  const handleFishCommand = (): string => {
    if (fishingCooldown > 0) return `Wait ${fishingCooldown}s before fishing again.`
    if (consecutiveFishing >= 3) {
      setFishingCooldown(30)
      setConsecutiveFishing(0)
      return "You've fished 3 times. Wait 30s to continue."
    }

    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
    const fishTypes = ["Trout", "Salmon", "Bass", "Tuna", "Shark", "Goldfish"]
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]
    const type = fishTypes[Math.floor(Math.random() * fishTypes.length)]
    const rarityIndex = rarities.indexOf(rarity)

    const xpGained = Math.floor((rarityIndex + 1) * 10 * (Math.random() + 0.5))
    const goldGained = Math.floor((rarityIndex + 1) * 5 * (Math.random() + 0.5))

    const newFish = {
      id: `fish-${Date.now()}`,
      name: `${rarity} ${type}`,
      rarity,
      xp: xpGained,
      gold: goldGained,
    }

    setInventory((prev) => [...prev, newFish])
    setConsecutiveFishing((prev) => prev + 1)
    return `You caught a ${rarity} ${type}! (XP: ${xpGained}, Gold: ${goldGained})`
  }

  const handleInventoryCommand = (): string => {
    if (inventory.length === 0) return "Your inventory is empty."
    return (
      `Inventory (${inventory.length} items):\n` +
      inventory.map((fish, i) => `${i + 1}. ${fish.name} - XP: ${fish.xp}, Gold: ${fish.gold}`).join("\n")
    )
  }

  const handleEatCommand = (fishIndex: string): string => {
    const index = Number(fishIndex) - 1
    if (isNaN(index) || index < 0 || index >= inventory.length) return "Invalid fish selection."
    const fish = inventory[index]
    setInventory(inventory.filter((_, i) => i !== index))
    setXp((prev) => prev + fish.xp)
    return `You ate the ${fish.name} and gained ${fish.xp} XP!`
  }

  const handleSellCommand = (args: string[]): string => {
    if (args[0] === "all") {
      if (inventory.length === 0) return "Your inventory is empty."
      const totalGold = inventory.reduce((sum, fish) => sum + fish.gold, 0)
      setInventory([])
      setGold((prev) => prev + totalGold)
      return `Sold all fish for ${totalGold} gold!`
    }
    const index = Number(args[0]) - 1
    if (isNaN(index) || index < 0 || index >= inventory.length) return "Invalid fish selection."
    const fish = inventory[index]
    setInventory(inventory.filter((_, i) => i !== index))
    setGold((prev) => prev + fish.gold)
    return `Sold ${fish.name} for ${fish.gold} gold!`
  }

  const handleSendMoneyCommand = (amount: string, user: string): string => {
    const goldAmount = Number(amount)
    if (!user || isNaN(goldAmount) || goldAmount <= 0) return "Invalid amount or user."
    if (goldAmount > gold) return "Not enough gold."
    setGold((prev) => prev - goldAmount)
    return `Sent ${goldAmount} gold to ${user}!`
  }

  const handleMessageCommand = (message: string): string => {
    if (!message) return "Message cannot be empty."
    if (gold < 100) return "Not enough gold to send a message (100 required)."
    setGold((prev) => prev - 100)
    return `Message sent: \"${message}\" (Cost: 100 gold)`
  }

  return {
    commandHistory,
    handleSubmit,
    input,
    setInput,
    scrollAreaRef,
    fishingCooldown,
  }
}
