export type AddAddressRequestModel = {
  id?: number;
  title: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  post_code: string;
  optional_note?: string;
};
