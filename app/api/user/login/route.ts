import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { username, password } = data;
    const existingUser = await User.findOne({ username });
    if (existingUser?.password === password) {
      return NextResponse.json(existingUser);
    }
    return NextResponse.json({ message: "Error: login failed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
