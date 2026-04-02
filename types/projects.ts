export type ProjectType = {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  people?: string[];
  link: string;
  repo?: string;
  created: Date;
};
