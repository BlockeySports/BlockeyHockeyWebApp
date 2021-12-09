import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(milliseconds: number): string {
    if (milliseconds == null) return ' ';
    // if negative, return 0:00
    if (milliseconds < 0) return '0:00';
    // extend the plugins for this to work
    dayjs.extend(duration);
    // format the duration and return it
    return dayjs.duration(milliseconds).format('m:ss');
  }
}
