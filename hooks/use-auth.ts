"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "CITIZEN" | "ADMIN"
  coins: number  
}

export function useAuth() {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const userData = await response.json()
      setUser(userData.user)
      return { success: true }
    } else {
      const error = await response.json()
      return { success: false, error: error.message }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("[v0] Starting registration request")
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      console.log("[v0] Registration response status:", response.status)
      console.log("[v0] Registration response headers:", response.headers.get("content-type"))

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        return { success: true }
      } else {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json()
          return { success: false, error: error.message }
        } else {
          const errorText = await response.text()
          console.log("[v0] Non-JSON error response:", errorText)
          return { success: false, error: "Registration failed. Please try again." }
        }
      }
    } catch (error) {
      console.error("[v0] Registration error:", error)
      return { success: false, error: "Network error. Please check your connection and try again." }
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
  }

  return { user, loading, login, register, logout }
}
