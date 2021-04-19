import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysSince'
})
export class DaysSincePipe implements PipeTransform {

  transform(date: any): number {
    if (!date) {
      return 0;
    }
    const oneDay = 1000 * 60 * 60 * 24;
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / oneDay);
    return days > 0 ? days : 0;
  }
}
