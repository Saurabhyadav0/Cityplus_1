import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

type Role = "CITIZEN" | "ADMIN"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Accept optional role for backward-compatibility, default to CITIZEN
export function generateToken(userId: string, role: Role = "CITIZEN"): string {
  const payload = { userId, role, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 } // 7 days
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

// Return role if present (older tokens without role still validate)
export function verifyToken(token: string): { userId: string; role?: Role } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    return { userId: payload.userId, role: payload.role }
  } catch {
    return null
  }
}
