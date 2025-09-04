import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Registration request received")

    await prisma.$connect()
    console.log("[v0] Database connection verified")

    const { name, email, password } = await request.json()
    console.log("[v0] Request data parsed successfully")

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("[v0] Checking for existing user")
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    console.log("[v0] Hashing password")
    const hashedPassword = await hashPassword(password)

    console.log("[v0] Creating user in database")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log("[v0] Generating token")
    const token = generateToken(String(user.id))
    console.log("[v0] Registration successful")
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Registration error details:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    if (error instanceof Error && error.message.includes("connect")) {
      console.error("[v0] Database connection error - check DATABASE_URL")
      return NextResponse.json(
        { message: "Database connection failed", details: "Please check DATABASE_URL environment variable" },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return NextResponse.json(
      { message: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
