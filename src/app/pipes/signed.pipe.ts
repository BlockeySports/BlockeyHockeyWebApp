import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signed'
})
export class SignedPipe implements PipeTransform {

  transform(num: number): string {
    // return number with sign as string
    return num > 0 ? '+' + num : num.toString();
  }
}
