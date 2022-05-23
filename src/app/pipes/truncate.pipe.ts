import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    // return empty string for no text
    if (value == null) return '';
    // if the text if less than or equal to the max length, return the text
    if (value.length <= args[0]) return value;
    // get character limit, default to 20
    const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    // get the trailing characters, default to '...'
    const trail = args.length > 1 ? args[1] : '...';
    // return the truncated string
    return value.substring(0, limit) + trail;
  }
}
