"use client"
import { useSession } from "next-auth/react"

export const getUserId = () => {
    const{ data:session} = useSession()
    return session?.user?.id
    }