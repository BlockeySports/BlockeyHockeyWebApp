import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() players: BoxScorePlayer[] = [];

    public rosterPlayers: Map<string, BoxScorePlayer> = new Map<string, BoxScorePlayer>();

    private MAX_VISIBLE_PLAYERS = 8;
    private LINE_HEIGHT = 1.625;

    constructor() { }

    ngOnInit(): void { }

    /**
     * Get the roster of players combining duplicate players with different positions.
     * @returns roster of box score players
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
        // sort rosterPlayers by time on ice descending, then alphabetically
        const sortedRosterPlayers = Array.from(rosterPlayers.values()).sort((a, b) => {
            if (a.timeOnIce > b.timeOnIce) { return -1; }
            if (a.timeOnIce < b.timeOnIce) { return 1; }
            if (a.member.username < b.member.username) { return -1; }
            if (a.member.username > b.member.username) { return 1; }
            return 0;
        });
        return new Set<BoxScorePlayer>(sortedRosterPlayers);
    }

    /**
     * Format position to put 'G' last is player is a goaltender and another position.
     * @returns formatted position
     */
    public formatPosition(position: string): string {
        if (position.includes('G/')) {
            return position.replace('G/', '').concat('/G');
        }
        return position;
    }

    public getMaxVisiblePlayers(): number {
        return this.MAX_VISIBLE_PLAYERS + (this.boxScore?.isSeries ? 1 : 0);
    }

    public getMaxRosterHeight(): string {
        return `${this.MAX_VISIBLE_PLAYERS * this.LINE_HEIGHT + (this.boxScore?.isSeries ? this.LINE_HEIGHT : 0) + (2 / 16)}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }
}
