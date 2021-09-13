import { Component, Input, OnInit } from '@angular/core';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {

    @Input() players: BoxScorePlayer[];

    constructor() { }

    ngOnInit(): void {
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

}
