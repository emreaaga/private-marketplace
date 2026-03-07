export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
} as const;

export const REFRESH_COOKIE_DELETE = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
} as const;

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000,
} as const;

export const ACCESS_COOKIE_DELETE = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
} as const;

export const USER_METADA_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
} as const;

export const USER_METADA_COOKIE_DELETE = {
  httpOnly: false,
  secure: false,
  sameSite: 'lax',
  path: '/',
} as const;
