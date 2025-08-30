import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { categorizeComplaint } from "@/lib/categories"

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

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        location,
        photoUrl,
        category,
        citizenId: payload.userId,
      },
      include: {
        citizen: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(complaint)
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
      where: { id: payload.userId },
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
          createdAt: "desc",
        },
      })
    } else {
      // Citizens can only see their own complaints
      complaints = await prisma.complaint.findMany({
        where: {
          citizenId: payload.userId,
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
