import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { _id, subs } = await req.json();
    const newUser = await User.findByIdAndUpdate(_id, { subscriptions: subs }, { new: true });
    return NextResponse.json(newUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
