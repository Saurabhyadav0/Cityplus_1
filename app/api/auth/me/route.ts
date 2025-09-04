import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
         coins: true,  
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
