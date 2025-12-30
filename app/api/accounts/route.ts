export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import { AccountType } from "@/types/accounts";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.SECRET_KEY, "base64");

if (KEY.length !== 32) {
  throw new Error("Invalid SECRET_KEY length");
}

export async function GET(req: NextRequest) {
  try {
    const userID = req.nextUrl.searchParams.get("id");
    await dbConnect();
    const existingUser = await User.findById(userID);
    const decryptedAccounts = existingUser.accounts.map((account: AccountType) => {
      const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(account.iv, "base64"));
      decipher.setAuthTag(Buffer.from(account.authTag, "base64"));
      let decrypted = decipher.update(account.password, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return { ...account, password: decrypted };
      //Fancy encryption logic learned from ChatGPT and research
      //TODO: critical security vulnerability if someone guesses mongodb user id the passwords are cooked bc api endpoint is exposed
    });
    if (existingUser) {
      return NextResponse.json(decryptedAccounts);
    } else {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { _id, accounts } = await req.json();
    const newAccounts = accounts.map((account: AccountType) => {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(ALGO, KEY, iv);
      let encrypted = cipher.update(account.password, "utf8", "base64");
      encrypted += cipher.final("base64");
      const authTag = cipher.getAuthTag();
      return { ...account, password: encrypted, iv: iv.toString("base64"), authTag: authTag.toString("base64") };
      //Fancy encryption logic learned from ChatGPT and research
    });
    const existingUser = await User.findByIdAndUpdate(_id, { accounts: newAccounts }, { new: true });
    if (existingUser) {
      return NextResponse.json(existingUser);
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
