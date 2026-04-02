import { SubscriptionType } from "./subscriptions";
import { AccountType } from "./accounts";
import { ProjectType } from "./projects";

export type UserType = {
  username: string;
  password?: string;
  display?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  __v?: number;
  subscriptions?: SubscriptionType[];
  accounts?: AccountType[];
  projects?: ProjectType[];
};
