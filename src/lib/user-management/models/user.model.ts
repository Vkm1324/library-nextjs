export interface IUserBase {
  // immutable data which has to kept safe
  name: string;
  email: string;
  image: string;
}

export interface IUserProfile extends IUserBase{
  DOB: Date;
  phoneNum: number;
  address: string;
}

// TODO IUserDisplay extends IUserBase omit password
export interface IUserDisplay extends Omit <IUserBase,"password" > {

}

export enum Roles {
  Admin = 6060,
  Editor = 4040,
  User = 2020,
} 

// TODO  extend IUserProfile rather than IUserBase
export interface IUser extends IUserBase {
  id: number;
  role: Roles;
}