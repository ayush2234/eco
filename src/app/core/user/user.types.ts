export interface GetUserByTokenResponse {
  user: User;
  access_token: string;
  ttl: number;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  tags?: string[];
  expire_at: number;
  role: string;
}
