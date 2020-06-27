import { Faculty } from '../faculty/faculty.model';
export class Group {
  id: string;
  title: string;
  faculty: Faculty;
  parent: Group;
}
