export type JwtRefreshToken = {
  sub: number;
};

export interface JwtAccessToken extends JwtRefreshToken {
  email: string;
}

export type LoginTokens = {
  accessToken: string;
  refreshToken: string;
};
