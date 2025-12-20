type Plan = {
  name: string;
  price: number;
};

type Service = {
  name: string;
  id: number;
  plans: Plan[];
};

export type ServicesType = Service[];

export type SubscriptionType = {
  id:string;
  serviceid: number;
  service: string;
  plan: string;
  price: number;
  name: string;
  description: string;
};