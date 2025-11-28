import { NextRequest, NextResponse } from "next/server"

const ADMIN_PASSWORD = "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { valid: false, message: "Password is required" },
        { status: 400 }
      )
    }

    const isValid = password === ADMIN_PASSWORD

    return NextResponse.json(
      {
        valid: isValid,
        message: isValid ? "Password correct" : "Invalid password",
      },
      { status: isValid ? 200 : 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { valid: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
