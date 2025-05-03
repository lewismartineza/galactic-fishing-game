import { Button } from "@heroui/react"
import { Fish, Package, Coins, UtensilsCrossed, BadgeDollarSign, Text } from "lucide-react"
type Props = {
    setInput: (val: string) => void
}

export function CommandQuickButtons({ setInput }: Props) {
    return (
        <div className="flex gap-2 mt-2">
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
    )
}
