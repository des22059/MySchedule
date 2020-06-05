// import { Role } from './role.model';

export class User {
  login: string;
  mail: string;
  password: string;
  roles: Array<string> = new Array();
}
