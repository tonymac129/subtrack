import { Schema, model, models, Document } from "mongoose";
import { SubscriptionType } from "@/types/subscriptions";
import { AccountType } from "@/types/accounts";

interface UserType extends Document {
  username: string;
  password: string;
  display: string;
  subscriptions: SubscriptionType[];
  accounts: AccountType[];
}

const UserSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    display: {
      type: String,
    },
    subscriptions: {
      type: [Schema.Types.Mixed],
      default: [],
    } as unknown as SubscriptionType[],
    accounts: {
      type: [Schema.Types.Mixed],
      default: [],
    } as unknown as AccountType[],
  },
  { timestamps: true }
);

const User = models.User || model<UserType>("User", UserSchema);
export default User;
