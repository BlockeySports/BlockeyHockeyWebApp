import { Component, Input, OnInit } from '@angular/core';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {

    @Input() players: BoxScorePlayer[];

    public maxVisiblePlayers = 8;

    constructor() { }

    ngOnInit(): void { }

    public getMaxRosterHeight(): string {
        return `${this.maxVisiblePlayers * 1.625 + 1.625}rem`;
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

}
