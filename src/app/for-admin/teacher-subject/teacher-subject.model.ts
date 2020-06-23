import { Subject } from 'rxjs';

import { Subject1 } from '../subjects/subject.model';
import { Teacher } from '../teachers/teacher.model';

export interface Subj {
  teacher: Teacher;
  subjects: [Subject1];
}
