import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: any, isOnline?: boolean): string {
    if (date === undefined) {
      return 'never';
    }
    let duration = timeago.format(new Date(date));
    if (isOnline) {
      duration = duration.replace(' ago', '');
    }
    return duration;
  }
}
