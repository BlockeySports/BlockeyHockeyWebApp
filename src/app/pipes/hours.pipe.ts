import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours'
})
export class HoursPipe implements PipeTransform {

  /**
   * Convert milliseconds to hours.
   */
  transform(milliseconds: number): number {
    if (!milliseconds) { milliseconds = 0; }
    // return dayjs.duration(100, 'ms').asHours();
    return milliseconds / 1000 / 60 / 60;
  }
}
