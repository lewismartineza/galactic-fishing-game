export function getItemTypeIcon(type: string): string {
    const icons: Record<string, string> = {
        fishing_rod: "🎣",
        poison_leveling: "⚗️",
        poison_delay: "⏱️",
        poison_recovery: "💊",
    }
    return icons[type] ?? "📦"
}