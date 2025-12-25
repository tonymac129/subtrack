import { SubscriptionType } from "./subscriptions";

export type UserType = {
  username: string;
  password?: string;
  display?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  __v?: number;
  subscriptions?: SubscriptionType[];
};
