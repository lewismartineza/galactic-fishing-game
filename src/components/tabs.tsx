import { Tabs as TabsHU, Tab } from "@heroui/react";
import { Market } from "./market";
import { LeaderBoard } from "./leaderboard";

type Props = {
    currentUsername: string;
};

export function Tabs({ currentUsername }: Props) {
    return (
        <div className="flex w-full flex-col overflow-auto h-[750px]">
            <TabsHU aria-label="Options">
                <Tab key="leaderboard" title="Leaderboard">
                    <LeaderBoard currentUsername={currentUsername} />
                </Tab>
                <Tab key="markets" title="Markets">
                    <Market />
                </Tab>
            </TabsHU>
        </div>
    );
}