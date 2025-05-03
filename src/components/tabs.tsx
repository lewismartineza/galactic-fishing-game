import { Tabs as TabsHU, Tab } from "@heroui/react";
import { Market } from "./market";
import { LeaderBoard } from "./leaderboard";

type Props = {
    currentUsername: string
}

export function Tabs({ currentUsername }: Props) {
    return (
        <div className="flex w-full flex-col overflow-auto no-scrollbar h-[750px]">
            <TabsHU aria-label="Options">
                <Tab key="markets" title="Markets">
                    <Market />
                </Tab>
                <Tab key="leaderboard" title="Leaderboard">
                    <LeaderBoard currentUsername={currentUsername} />
                </Tab>
            </TabsHU>
        </div>
    )
}
