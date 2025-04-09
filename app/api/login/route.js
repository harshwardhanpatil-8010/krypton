
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const db = await connectToDatabase();
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const response = new NextResponse(
      JSON.stringify({ message: "Login successful", userId: user.user_id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    response.cookies.set("userId", user.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", { maxAge: 0 }); 
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed", error: error.message },
      { status: 500 }
    );
  }
}