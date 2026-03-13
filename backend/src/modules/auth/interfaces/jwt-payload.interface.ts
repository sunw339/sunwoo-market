export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface CurrentUserInfo {
  userId: number;
  email: string;
  role: string;
}