// Función para guardar datos del usuario
export function saveUserData(data: {
    username: string;
    level: number;
    xp: number;
    gold: number;
    rank?: number;
}) {
    localStorage.setItem("username", JSON.stringify(data.username));
    localStorage.setItem("level", JSON.stringify(data.level));
    localStorage.setItem("xp", JSON.stringify(data.xp));
    localStorage.setItem("gold", JSON.stringify(data.gold));
    if (data.rank) {
        localStorage.setItem("rank", JSON.stringify(data.rank));
    }
}

// Función para obtener todos los datos del usuario
export function getUserData() {
    return {
        username: JSON.parse(localStorage.getItem("username") || "Guest"),
        level: JSON.parse(localStorage.getItem("level") || "0"),
        xp: JSON.parse(localStorage.getItem("xp") || "0"),
        gold: JSON.parse(localStorage.getItem("gold") || "0"),
        rank: JSON.parse(localStorage.getItem("rank") || "0"),
    };
}