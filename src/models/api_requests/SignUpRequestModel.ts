export type SignUpRequestModel = {
  full_name?: string;
  postcode?: string;
  date_of_birth?: string;
  gender?: string;
  provider?: string;
  oapa_code?: string;

  //email
  email?: string;
  password?: string;

  //social
  social_account_id?: string;
  access_token?: string;
  profile_image?: string;

  //phone login
  contact_number?: string;
  //Account Settings
  id?: number;
  old_password?: string;
  new_password?: string;
};
