import { Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerService } from '../services/player.service';

@Pipe({
  name: 'player'
})
export class PlayerPipe implements PipeTransform {

  // Subs
  private playerSub: Subscription;

  constructor(
    private playerService: PlayerService
  ) { }

  transform(uuid: string): string {
    this.playerSub = this.playerService.getPlayerInfo(uuid).subscribe(
      (data) => {
        return data.username;
      },
      (error) => {
        console.log(error);
      }
    );
    if (this.playerSub) { this.playerSub.unsubscribe(); }
    return '';
  }
}
