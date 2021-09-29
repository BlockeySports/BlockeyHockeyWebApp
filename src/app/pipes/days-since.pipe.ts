import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'daysSince'
})
export class DaysSincePipe implements PipeTransform {

  transform(date: any): number {
    if (!date) return 0;
    return dayjs().diff(dayjs(date), 'day');
  }
}
