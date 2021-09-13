import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes'
})
export class MinutesPipe implements PipeTransform {

  /**
   * Convert milliseconds to minutes.
   */
  transform(milliseconds: number): string {
    if (!milliseconds) { return ''; }
    const minutes = Math.floor(milliseconds / 60000);
    // return minutes with correct pluralization
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
}
