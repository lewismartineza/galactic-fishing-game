import { Input } from "@heroui/react"
import { Button } from "@heroui/react"
import { Send } from "lucide-react"
import { RefObject } from "react"

type Props = {
    input: string
    setInput: (val: string) => void
    inputRef: RefObject<HTMLInputElement>
    handleSubmit: (e: React.FormEvent) => void
}

export function CommandInput({ input, setInput, inputRef, handleSubmit }: Props) {
    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command (e.g. /help)"
                className="bg-slate-900 border-slate-700"
                autoComplete="off"
            />
            <Button type="submit" size="sm">
                <Send className="h-4 w-4" />
            </Button>
        </form>
    )
}
