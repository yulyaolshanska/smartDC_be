export interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface GoogleDoctorResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isVerified: boolean;
  role: string;
  address: string;
  birthDate: string;
  city: string;
  country: string;
  specialityId: number;
  photoUrl: string;
  timeZone: string;
  gender: string;
}
