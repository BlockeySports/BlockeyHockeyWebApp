import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours'
})
export class HoursPipe implements PipeTransform {

  /**
   * Convert milliseconds to hours.
   */
  transform(milliseconds: number): number {
    return (milliseconds && milliseconds > 0) ? (milliseconds / 1000 / 60 / 60) : 0;
  }
}
