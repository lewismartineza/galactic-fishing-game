import { Tabs as TabsHU, Tab } from "@heroui/react";
import { Market } from "./market";
import { Leaderboard } from "./leaderboard";

export function Tabs() {
    return (
        <div className="flex w-full flex-col">
            <TabsHU aria-label="Options">
                <Tab key="markets" title="Markets">
                    <Market />
                </Tab>
                <Tab key="leaderboard" title="Leaderboard">
                    <Leaderboard />
                </Tab>
            </TabsHU>
        </div>
    );
}