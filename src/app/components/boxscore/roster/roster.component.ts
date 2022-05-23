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

    private MAX_VISIBLE_PLAYERS = 8;
    private LINE_HEIGHT = 1.625;

    constructor() { }

    ngOnInit(): void { }

    /**
     * Format position to put 'G' last is player is a goaltender and another position.
     * @param player The box score player to get the position from.
     * @returns formatted position
     */
    public getPosition(player: BoxScorePlayer): string {
        let position = '';
        // if player was a forward
        if (player.shifts.flatMap(shift => shift.iceTimeRecords).some(itr => itr.position.code === 'F'))
            position += 'F';
        // if player was a defender
        if (player.shifts.flatMap(shift => shift.iceTimeRecords).some(itr => itr.position.code === 'D'))
            position += position?.length > 0 ? '/D' : 'D';
        // if player was a goaltender
        if (player.shifts.flatMap(shift => shift.iceTimeRecords).some(itr => itr.position.code === 'G'))
            position += position?.length > 0 ? '/G' : 'G';
        // return the position
        return position;
    }

    public getMaxVisiblePlayers(): number {
        return this.MAX_VISIBLE_PLAYERS + (this.boxScore?.series ? 1 : 0);
    }

    public getMaxRosterHeight(): string {
        return `${this.MAX_VISIBLE_PLAYERS * this.LINE_HEIGHT + (this.boxScore?.series ? this.LINE_HEIGHT : 0) + (2 / 16)}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }
}
