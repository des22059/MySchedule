import { Teacher } from '../for-admin/teachers/teacher.model';
import { Faculty } from '../for-admin/faculty/faculty.model';
import { Subject1 } from '../for-admin/subjects/subject.model';

export class Discipline {
  id: string;
  teacher: Teacher;
  subject: Subject1;
}
