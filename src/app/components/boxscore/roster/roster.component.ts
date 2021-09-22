import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit, OnChanges {

    @Input() boxScore: BoxScore;
    @Input() players: BoxScorePlayer[] = [];

    public rosterPlayers: Map<string, BoxScorePlayer> = new Map<string, BoxScorePlayer>();

    private MAX_VISIBLE_PLAYERS = 8;
    private LINE_HEIGHT = 1.71875;

    constructor(
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void { }

    ngOnChanges(): void {
        // if (this.players) {
        //     this.createRoster();
        // }
    }

    /**
     * Add all input players to the roster players.
     * If there are players in the roster with the same member uuid and a different position,
     * then make the position include both separated by a slash.
     */
    public getRoster(): Set<BoxScorePlayer> {
        const rosterPlayers: Map<string, BoxScorePlayer> = new Map<string, BoxScorePlayer>();
        // if players are not defined, return an empty set
        if (!this.players) { return new Set<BoxScorePlayer>(); }
        // for each box score player
        this.players.forEach(player => {
            // if that player is already in the roster
            if (rosterPlayers.has(player.member.uuid)) {
                // and the position is different
                if (!rosterPlayers.get(player.member.uuid).position.includes(player.position)) {
                    // add the position to the existing player's position separated by a slash
                    rosterPlayers.get(player.member.uuid).position += `/${player.position}`;
                }
            } else {
                // add the player to the roster
                rosterPlayers.set(player.member.uuid, player);
            }
        });
        // return the roster players
        return new Set(rosterPlayers.values());
    }

    // public createRoster(): void {
    //     console.log('create roster called');
    //     // define roster players
    //     // const rosterPlayers: Map<string, BoxScorePlayer> = new Map<string, BoxScorePlayer>();
    //     // for each player
    //     this.players.forEach(player => {
    //         // console.log(rosterPlayers);
    //         // if player is already in roster
    //         if (this.rosterPlayers.has(player.member.uuid)) {
    //             // then check if the position differs
    //             if (player.position !== this.rosterPlayers.get(player.member.uuid).position) {
    //                 // if so, change position to include both separated by a slash
    //                 // this.rosterPlayers.get(player.member.uuid).position = `${this.rosterPlayers.get(player.member.uuid).position}/${player.position}`;

    //                 // Promise.resolve().then(() => { this.rosterPlayers.get(player.member.uuid).position += `/${player.position}`; });
    //                 this.rosterPlayers.get(player.member.uuid).position += `/${player.position}`;

    //             }
    //         } else {
    //             // Promise.resolve().then(() => { this.rosterPlayers.set(player.member.uuid, player); });
    //             this.rosterPlayers.set(player.member.uuid, player);
    //         }
    //     });
    // }

    public getMaxVisiblePlayers(): number {
        return this.MAX_VISIBLE_PLAYERS + (this.boxScore?.isSeries ? 1 : 0);
    }

    public getMaxRosterHeight(): string {
        return `${this.MAX_VISIBLE_PLAYERS * this.LINE_HEIGHT + (this.boxScore?.isSeries ? this.LINE_HEIGHT : 0)}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }

}
