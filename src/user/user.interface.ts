export interface UserData {
  id: number;
  email: string;
  name: string;
  passwordMustChange: boolean;
  isSuperUser: boolean;
}

export interface UserRO {
  user: UserData;
}
