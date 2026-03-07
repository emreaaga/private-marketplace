export const REGEX = {
  PERSON_NAME: /^[\p{L}]+(?:[- '][\p{L}]+)*$/u,
  COUNTRY_ISO: /^[a-z]{2}$/,
  CITY_ISO: /^[a-z]{3}$/,
  PHONE_COUNTRY_CODE: /^\d{1,4}$/,
  PHONE_NUMBER: /^\d{5,20}$/,
  DISTRICT_ONE_WORD: /^[A-Za-z]+$/,

  // Старые, их нужно в будущем убрать
  COUNTRY_ISO2: /^[A-Z]{2}$/,
  CITY_CODE: /^[A-Z]{3}$/,
} as const;
