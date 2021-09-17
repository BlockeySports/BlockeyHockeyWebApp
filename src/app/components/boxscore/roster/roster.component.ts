import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() players: BoxScorePlayer[];

    private MAX_VISIBLE_PLAYERS = 8;
    private LINE_HEIGHT = 1.71875;

    constructor() { }

    ngOnInit(): void { }

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
