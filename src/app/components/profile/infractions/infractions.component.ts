import { AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Punishment } from 'src/app/models/Punishment';
import { PlayerService } from 'src/app/services/player.service';

@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html'
})
export class InfractionsComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() punishments: Punishment[];

    // Subs
    private playerSub: Subscription;

    constructor(
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(
            () => {
                for (const punishment of this.punishments) {
                    this.getUsernameFromUuid(punishment);
                }
            }, 500
        );

    }

    // TODO: make punisher and punished Member objects instead of just uuids
    public getUsernameFromUuid(punishment: Punishment): void {
        this.playerSub = this.playerService.getPlayerInfo(punishment.punisher).subscribe(
            (data) => {
                punishment.punisher = data.username;
            },
            (error) => {
                console.log(error);
                punishment.punisher = 'Error';
            }
        );
    }

    ngOnDestroy(): void {
        if (this.playerSub) { this.playerSub.unsubscribe(); }
    }

}
