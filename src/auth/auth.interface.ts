export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
