export type AccountType = {
  id: string;
  service: string;
  username: string;
  password: string;
  notes: string;
  created: Date;
  custom?: boolean;
  iv?: string;
  authTag?: string;
};

type AccountService = {
  id: number;
  name: string;
  img: string;
};

export type AccountsType = AccountService[];
