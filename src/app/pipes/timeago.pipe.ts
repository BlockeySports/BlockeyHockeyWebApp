import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: any, isOnline?: boolean): string {
    // if no date, return 'never'
    if (!date) return 'never';
    // create date from string date
    const d = new Date(date);
    // if date is invalid
    if (!d.getTime()) return 'unknown';
    // create duration string form date
    let duration = timeago.format(d);
    // if player is online, remove 'ago' from string
    if (isOnline) duration = duration.replace(' ago', '');
    // return duration string
    return duration;
  }
}
