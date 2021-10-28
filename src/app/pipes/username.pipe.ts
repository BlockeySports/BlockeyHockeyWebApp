import { Pipe, PipeTransform } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  constructor(
    private playerService: PlayerService
  ) { }

  transform(uuid: string): string {
    this.playerService.getPlayerInfo(uuid).subscribe(
      (data) => {
        return data.username;
      },
      (error) => {
        console.log(error);
      }
    );
    return '';
  }

}
