import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { _id, display } = await req.json();
    const existingUser = await User.findByIdAndUpdate(_id, { display }, { new: true });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 500 });
    } else {
      return NextResponse.json(existingUser);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
