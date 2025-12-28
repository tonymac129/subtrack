import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { SubscriptionType } from "@/types/subscriptions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const existingUser = await User.findById(id);
    if (!existingUser) return NextResponse.json({ message: "Error: failed to retrieve user data" }, { status: 404 });
    const yesterday = new Date().setDate(new Date().getDate() - 1);
    //TODO: fix this currently yesterday is storing exactly 24 hours before current time, should be at exactly the start of today
    const updatedSubscriptions = existingUser.subscriptions.map((sub: SubscriptionType) => {
      const nextRenewal = new Date(sub.renews);
      while (nextRenewal < new Date(yesterday)) {
        if (sub.duration === "month") {
          nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        } else {
          nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        }
        console.log(nextRenewal);
      }
      return { ...sub, renews: nextRenewal };
    });
    existingUser.subscriptions = updatedSubscriptions;
    existingUser.markModified("subscriptions");
    await existingUser.save();
    return NextResponse.json(updatedSubscriptions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
