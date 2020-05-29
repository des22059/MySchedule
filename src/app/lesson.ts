export interface Lesson {
  title: string;
  position: any;
  day: any;
  type: string;
  audience: number;
  building: number;
  teacher: { surname: string; name: string; patronymic: string }; //Idk how to do it
  week: number;
}
