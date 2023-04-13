export const NO_ROWS_AFFECTED = 0;
export const SUCCESS_STATUS_CODE = 200;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
export const HASH_NUMBER = 5;
export const NAME_MIN_LENGTH = 3;

export const CITY_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const ADDRESS_REGEX = /^[A-Za-z0-9\s,'-.]+$/;
export const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
export const TIME_ZONE_REGEX = /\(\w{3}[+-]\d{1,2}\)\s\w+\/\w+/;

export const SEVEN = 7;

export const GOOGLE_URL = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token'