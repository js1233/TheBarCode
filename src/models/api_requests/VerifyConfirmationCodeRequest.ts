export type VerifyConfirmationCodeRequest = {
  contact_number?: string;
  email?: string;
  activation_code?: string;
  isFromMobile: boolean;
};
