import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

type Props = {
    onConfirm: (username: string) => void
}

export default function UserNameModal({ onConfirm }: Props) {
    const [username, setUsername] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = () => {
        if (username.trim()) {
            localStorage.setItem("username", username.trim())
            onConfirm(username.trim())
        }
    }

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-4 text-slate-900">Enter your user name.</h2>
                <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded mb-4"
                    placeholder="Your Name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!username.trim()}
                    className="w-full  text-black py-2 rounded  disabled:bg-gray-400"
                >
                    Play
                </button>
            </div>
        </div>,
        document.body
    )
}
