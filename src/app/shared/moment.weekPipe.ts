import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'weekmoment',
  pure: false,
})
export class WeekPipe implements PipeTransform {
  transform(m: moment.Moment, format: string = 'DD.MM.yyyy'): string {
    return m.format(format);
  }
}
