import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const existingUser = await User.findById(id);
    if (existingUser) {
      return NextResponse.json(existingUser.subscriptions);
    } else {
      return NextResponse.json({ message: "Error: failed to retrieve user data" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
