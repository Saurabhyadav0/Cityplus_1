import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { categorizeComplaint } from "@/lib/categories"
import { generatePriorityScore } from "@/lib/ai-priority"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { title, description, location, photoUrl } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 })
    }

    const category = categorizeComplaint(title, description)

    // ⭐ AI-based priority score
    let priority = 1
    try {
      priority = await generatePriorityScore(title, description, photoUrl)
      console.log("🎯 Final priority from AI:", priority)
    } catch (err) {
      console.warn("AI priority generation failed, using default = 1", err)
    }

    // 1️⃣ Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        location,
        photoUrl,
        category,
        citizenId: Number(payload.userId),
        priority,
      },
    })

    // 2️⃣ Update coins (+5)
    const updatedUser = await prisma.user.update({
      where: { id: Number(payload.userId) },
      data: { coins: { increment: 5 } },
      select: {
        id: true,
        name: true,
        email: true,
        coins: true,
      },
    })

    // 3️⃣ Return complaint + updated coins
    return NextResponse.json({
      message: "Complaint created successfully",
      complaint,
      user: updatedUser,
      reward: updatedUser.coins , // optional - tells frontend how many coins earned
    })
  } catch (error) {
    console.error("Create complaint error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}



export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    let complaints

    if (user.role === "ADMIN") {
      // Admin can see all complaints
      complaints = await prisma.complaint.findMany({
        include: {
          citizen: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          priority: "desc", // ⭐ highest priority first
        },
      })
    } else {
      // Citizens can only see their own complaints
      complaints = await prisma.complaint.findMany({
        where: {
          citizenId: Number(payload.userId),
        },
        include: {
          citizen: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return NextResponse.json(complaints)
  } catch (error) {
    console.error("Get complaints error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
