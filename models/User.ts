import { Schema, model, models, Document } from "mongoose";

interface UserType extends Document {
  username: string;
  password: string;
  display: string;
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
  },
  { timestamps: true }
);

const User = models.User || model<UserType>("User", UserSchema);
export default User;
