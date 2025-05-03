import { useRef } from "react"
import { Input, Button } from "@heroui/react"
import { Send, HelpCircle, Fish, Package, Coins, UtensilsCrossed, BadgeDollarSign, Text } from "lucide-react"
import { useCommandConsole } from "../hooks/useCommandConsole"
import { CommandLog } from "./command-log"

export function CommandConsole() {
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        input,
        setInput,
        handleSubmit,
        commandHistory,
        fishingCooldown,
    } = useCommandConsole()

    return (
        <div className="flex flex-col h-[750px] w-auto bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-3 border-b border-slate-700 bg-slate-900 rounded-t-lg">
                <h2 className="text-lg font-semibold flex items-center text-slate-400">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Command Console
                </h2>
            </div>

            <div className="flex-1 p-3 overflow-auto no-scrollbar">
                {fishingCooldown > 0 && (
                    <div className="text-amber-400 text-sm mt-2">
                        Fishing cooldown: {fishingCooldown}s remaining
                    </div>
                )}
                <CommandLog entries={[...commandHistory].reverse()} />
            </div>

            <div className="p-3 border-t border-slate-700">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a command (e.g. /help)"
                        className="bg-slate-900 text-slate-400 rounded-md p-1 focus-none:focus"
                        autoComplete="off"
                    />
                    <Button type="submit">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>

                <div className="grid grid-rows-2 grid-cols-4 gap-2 mt-4">
                    <Button className="flex" onPress={() => setInput("/fish")}>
                        <Fish className="mr-1" />
                        Fish
                    </Button>
                    <Button className="flex" onPress={() => setInput("/inventory")}>
                        <Package className="mr-1" />
                        Inventory
                    </Button>
                    <Button className="flex" onPress={() => setInput("/sell all")}>
                        <Coins className="mr-1" />
                        Sell All
                    </Button>
                    <Button className="flex" onPress={() => setInput("/sell <number of fish>")}>
                        <Coins className="mr-1" />
                        Sell Fish
                    </Button>
                    <Button className="flex" onPress={() => setInput("/eat <number of fish>")}>
                        <UtensilsCrossed className="mr-1" />
                        Eat
                    </Button>
                    <Button className="flex" onPress={() => setInput("/message <text>")}>
                        <Text className="mr-1" />
                        Message
                    </Button>
                    <Button className="flex" onPress={() => setInput("/send-money <amount> <user>")}>
                        <BadgeDollarSign className="mr-1" />
                        Send Money
                    </Button>
                </div>
            </div>
        </div>
    )
}
