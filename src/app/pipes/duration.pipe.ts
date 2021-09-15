import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(milliseconds: number): string {
    // extend the plugins for this to work
    dayjs.extend(duration);
    return dayjs.duration(milliseconds).format('m:ss');
  }
}
