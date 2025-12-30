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
    const yesterday = new Date(`${new Date().toLocaleDateString()}`);
    //TODO: fix this again renews is stored in utc for some reason
    const updatedSubscriptions = existingUser.subscriptions.map((sub: SubscriptionType) => {
      const nextRenewal = new Date(sub.renews);
      while (nextRenewal < yesterday) {
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
