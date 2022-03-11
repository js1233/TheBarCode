import DateTime from "./DateTime";

export interface BarMenuCategory {
  id: number;
  name: string;
  image: string;
  type: string;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: null;
}
