import { Button } from "@heroui/react"
import { Fish, Package, Coins, ShoppingCart } from "lucide-react"

type Props = {
    setInput: (val: string) => void
}

export function CommandQuickButtons({ setInput }: Props) {
    return (
        <div className="flex gap-2 mt-2">
            <Button size="sm" className="text-xs" onClick={() => setInput("/fish")}>
                <Fish className="h-3 w-3 mr-1" />
                Fish
            </Button>
            <Button size="sm" className="text-xs" onClick={() => setInput("/inventory")}>
                <Package className="h-3 w-3 mr-1" />
                Inventory
            </Button>
            <Button size="sm" className="text-xs" onClick={() => setInput("/sell all")}>
                <Coins className="h-3 w-3 mr-1" />
                Sell All
            </Button>
            <Button size="sm" className="text-xs" onClick={() => setInput("/market")}>
                <ShoppingCart className="h-3 w-3 mr-1" />
                Market
            </Button>
        </div>
    )
}
