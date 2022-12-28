import { Pageable } from 'app/layout/common/grid/grid.types';

export interface UserListResponse extends Pageable {
  users: User[];
}

export interface GetUserByTokenResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: string;
  expire_at: number;
  role: string;
  companies?: Company[];
  active_status: string | boolean;
  note?: string;
  access_token: string;
  ttl: number;
}

export interface Company {
  company_id: string;
  company_name?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: string;
  expire_at: number;
  role: string;
  companies?: Company[];
  active_status?: string | boolean;
  note?: string;
  access_token: string;
  ttl: number;
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
