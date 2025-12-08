export type CreatedUser = {
  id: number;
  email: string;
};

export type UserByEmail = {
  id: number;
  email: string;
  password: string;
  role: string;
};

export type UserById = {
  id: number;
  email: string;
  role: string;
};
