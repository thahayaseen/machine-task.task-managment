export interface IUser {
  _id: string;
  username: string;
  role: "admin" | "user";
  email: string;
  password: string;
}
