"use client"

import { useEffect, useState } from "react"

type UserData = {
    username: string
    level: number
    xp: number
    gold: number
    rank: number
}

export function useLocalStorageData(updateInterval = 5000) {
    const [userData, setUserData] = useState<UserData>(() => {
        const safeParse = (key: string, defaultValue: any) => {
            try {
                const item = localStorage.getItem(key)
                return item ? JSON.parse(item) : defaultValue
            } catch {
                return defaultValue
            }
        }

        return {
            username: safeParse("username", "Guest"),
            level: safeParse("level", 0),
            xp: safeParse("xp", 0),
            gold: safeParse("gold", 0),
            rank: safeParse("rank", 0)
        }
    })

    useEffect(() => {
        const updateUserData = () => {
            setUserData(prev => {
                const newData = {
                    username: localStorage.getItem("username") || prev.username,
                    level: Number(localStorage.getItem("level")) || prev.level,
                    xp: Number(localStorage.getItem("xp")) || prev.xp,
                    gold: Number(localStorage.getItem("gold")) || prev.gold,
                    rank: Number(localStorage.getItem("rank")) || prev.rank
                }
                return JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData
            })
        }

        updateUserData()
        const intervalId = setInterval(updateUserData, updateInterval)
        return () => clearInterval(intervalId)
    }, [updateInterval])

    return userData
}