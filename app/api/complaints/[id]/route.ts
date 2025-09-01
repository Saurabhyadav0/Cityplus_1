import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // ✅ Convert userId to number
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 })
    }

    const { status, assignedTo } = await request.json()

    // ✅ Convert complaint id to number
    const complaint = await prisma.complaint.update({
      where: { id: Number(params.id) },
      data: {
        ...(status && { status }),
        ...(assignedTo !== undefined && { assignedTo: assignedTo }),
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
    console.error("Update complaint error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}