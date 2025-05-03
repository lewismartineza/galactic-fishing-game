import { CommandType } from "../types/console"

type CommandLogProps = {
    entries: CommandType[]
}

export function CommandLog({ entries }: CommandLogProps) {
    return (
        <div className="space-y-2">
            {entries.map((entry, i) => (
                <div key={i} className="text-sm text-white">
                    <div className="text-slate-400"> {entry.command}</div>
                    <pre className="whitespace-pre-wrap text-green-400">{entry.response}</pre>
                </div>
            ))}
        </div>
    )
}
