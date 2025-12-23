import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { username, password } = data;
    const existingUser = await User.findOne({ username });
    if (existingUser) return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    const newUser = await User.create({ username, password });
    return NextResponse.json(newUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
