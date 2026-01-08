export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  user?: User;
  error?: string;
};

export type ApiUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AuthApiResponse = {
  user: ApiUser;
  accessToken: string;
  refreshToken?: string;
};