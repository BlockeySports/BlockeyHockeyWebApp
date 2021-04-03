import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: any): string {
    return timeago.format(new Date(date));
  }
}
