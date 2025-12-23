import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { jwt } = await req.json();
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const googleUser = await res.json();
    const existingUser = await User.findOne({ username: googleUser.email });
    if (existingUser) {
      return NextResponse.json(existingUser);
    } else {
      const newUser = await User.create({ username: googleUser.email, display: googleUser.name });
      return NextResponse.json(newUser);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
