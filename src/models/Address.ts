import DateTime from "./DateTime";

export interface Address {
  id: number;
  user_id: number;
  title: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  optional_note: string;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: DateTime;
  post_code: string;
}
