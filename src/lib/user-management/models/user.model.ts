export interface IUserBase {
  // immutable data which has to kept safe
  name: string;
  email: string;
  image?: string | undefined;
  DOB: Date | null ;
  phoneNum: number | null;
  address: string | null;
}

export interface IUserProfile extends IUserBase{

}

export enum Roles {
  Admin = 5050,
  Editor = 4040,
  User = 2020,
} 

export interface IUser extends IUserProfile {
  id: number;
  role: Roles;
}

export interface IUserDisplay extends Omit<IUser, "role"> {

}
