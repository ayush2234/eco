import { Pageable } from 'app/layout/common/grid/grid.types';

export interface UserListResponse extends Pageable {
  users: User[];
}

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
  expire_at: number;
  role: string;
  companies?: string[];
  active_status: string;
  note?: string;
}

export interface CreateUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  expire_at: number;
  role: string;
  companies?: string[];
  password?: string;
  is_active: string;
  note?: string;
}
