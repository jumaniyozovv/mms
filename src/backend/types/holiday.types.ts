export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  recurring: boolean;
  createdAt: string;
}

export interface CreateHolidayInput {
  name: string;
  date: string;
  recurring: boolean;
}

export interface UpdateHolidayInput {
  name: string;
  date: string;
  recurring: boolean;
}
