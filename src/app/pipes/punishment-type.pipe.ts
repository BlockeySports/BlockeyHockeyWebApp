import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'punishmentType'
})
export class PunishmentTypePipe implements PipeTransform {

  transform(type: string): string {
    switch (type.toLowerCase()) {
      case 'warn':
        return 'Warning';
      case 'kick':
        return ' Kick';
      case 'temp_mute':
        return 'Temp Mute';
      case 'mute':
        return 'Permanent Mute';
      case 'temp_ban':
        return 'Temp Ban';
      case 'ban':
        return 'Permanent Ban';
      default:
        return 'Unknown';
    }
  }
}
