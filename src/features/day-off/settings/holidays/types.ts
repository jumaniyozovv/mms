export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  createdAt: string;
}

export interface CreateHolidayInput {
  name: string;
  date: string;
}

export interface UpdateHolidayInput {
  name: string;
  date: string;
}
