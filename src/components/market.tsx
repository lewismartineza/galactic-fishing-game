"use client"

import { Loader2 } from "lucide-react"
import { useMarketData } from "../hooks/useMarketData"
import { MarketItemCard } from "./MarketItemCard"
import { Card, CardHeader, CardBody, Alert } from "@heroui/react"

export function Market() {
    const { items, loading, error } = useMarketData()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        )
    }

    return (
        <Card className="bg-slate-800 border-slate-700 gap-6 mt-6 p-4 rounded-lg">
            <CardHeader>
                <div className="text-xl text-slate-400">Market Items</div>
            </CardHeader>
            <CardBody>
                {error && (
                    <Alert
                        className="mb-4 bg-amber-900/30 border-amber-800"
                        title="Alert"
                        description={error}
                    />
                )}
                <div className="space-y-4">
                    {items.map((item) => (
                        <MarketItemCard key={item.id} item={item} />
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}

