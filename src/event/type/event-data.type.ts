export type EventData = {
  id: number;
  hostId: number;
  title: string;
  description: string;
  categoryId: number;
  eventCity: {
    cityId: number;
  }[];
  startTime: Date;
  endTime: Date;
  maxPeople: number;
};
