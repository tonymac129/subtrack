import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ProjectType } from "@/types/projects";

export async function POST(req: NextRequest) {
  try {
    const userID = req.nextUrl.searchParams.get("id");
    const { createdAt } = await req.json();
    await dbConnect();
    const existingUser = await User.findById(userID);
    if (existingUser.createdAt.getTime() === new Date(createdAt).getTime()) {
      if (existingUser) {
        return NextResponse.json(existingUser.projects);
      } else {
        return NextResponse.json(
          { message: "User does not exist" },
          { status: 404 },
        );
      }
    } else {
      console.log("not authorized");
      return NextResponse.json({
        message: "You are not authorized to fetch this user's data",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { _id, projects } = await req.json();
    const existingUser = await User.findByIdAndUpdate(
      _id,
      { projects },
      { new: true },
    );
    if (existingUser) {
      return NextResponse.json(existingUser);
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
