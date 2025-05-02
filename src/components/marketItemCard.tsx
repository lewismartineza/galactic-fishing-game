import { Market } from "../core/entities"
import { Tooltip, Button } from "@heroui/react"
import { Info, ShoppingCart } from "lucide-react"
import { getItemTypeIcon } from "../core/utils/itemIcons"

interface Props {
    item: Market
}

export function MarketItemCard({ item }: Props) {
    return (
        <div className="p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{getItemTypeIcon(item.type)}</div>
                    <div>
                        <h3 className="font-medium text-slate-400">{item.name}</h3>
                        <p className="text-sm text-slate-400">{item.type.replace("_", " ")}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-medium text-yellow-400">{item.cost} gold</p>
                </div>
            </div>

            <p className="mt-2 text-sm text-slate-400">{item.description}</p>

            <div className="mt-4 flex justify-between items-center">
                <Tooltip className="bg-black rounded-lg text-slate-400 p-2" content={`Item ID: ${item.id.substring(0, 8)}...`} showArrow>
                    <Button className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Detail
                    </Button>
                </Tooltip>
                <Button className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Buy
                </Button>
            </div>
        </div>
    )
}
