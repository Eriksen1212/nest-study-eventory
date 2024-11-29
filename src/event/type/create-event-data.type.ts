export type CreateEventData = {
  hostId: number;
  title: string;
  description: string;
  categoryId: number;
  cityIds: number[];
  startTime: Date;
  endTime: Date;
  maxPeople: number;
};
