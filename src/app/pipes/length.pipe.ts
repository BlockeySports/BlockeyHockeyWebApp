import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {

  transform(length: number): string {
    if (length < 0) {
      return 'Forever';
    }
    if (length === 0) {
      return 'None';
    }
    // extend the plugins for this to work
    dayjs.extend(duration);
    dayjs.extend(relativeTime);
    // make the duration display in a human readable way
    return dayjs.duration(length).humanize();
  }
}
