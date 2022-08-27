import { User } from '../user/user.types';

export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  user: User;
  access_token: string;
  ttl: number;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
