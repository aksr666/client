export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  hasPassword: boolean;
  participants?: User[];
}

export type CursorState = {
  x: number;
  y: number;
  user: User;
};
