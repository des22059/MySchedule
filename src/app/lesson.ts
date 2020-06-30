import { Audience } from './for-admin/audience/audience.model';
import { LessonType } from './for-admin/lesson-types/lessonType.model';
import { Discipline } from './lesson/discipline.model';

export interface Lesson {
  discipline: Discipline;
  position: any;
  day: any;
  lessonType: LessonType;
  audience: Audience;
  teacher: { surname: string; name: string; patronymic: string }; //Idk how to do it
  week: number;
}
