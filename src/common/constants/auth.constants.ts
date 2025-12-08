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
