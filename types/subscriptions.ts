type Plan = {
  name: string;
  price: number;
};

export type Service = {
  name: string;
  id: number;
  plans: Plan[];
  category: string;
  img: string;
};

export type ServicesType = Service[];

export type SubscriptionType = {
  id: string;
  serviceid: number;
  service: string;
  plan: string;
  price: number | string;
  name: string;
  description: string;
  duration: string;
  timeCreated: Date;
  renews: Date;
  category?: string;
};
