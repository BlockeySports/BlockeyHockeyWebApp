import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {

  transform(length: number, date: Date): string {
    if (length < 0) {
      return 'Forever';
    }
    if (length <= 10) {
      return 'None';
    }
    const duration = timeago.format(new Date(new Date(date).getTime() + length));
    return duration.replace('in ', '');
  }
}
