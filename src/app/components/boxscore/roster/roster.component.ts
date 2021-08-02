import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/Member';

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html'
})
export class RosterComponent implements OnInit {

    @Input() players: Member[];

    constructor() { }

    ngOnInit(): void {
    }

    public navigateToProfile(username: string): void {
        window.location.href = '/u/' + username;
    }

}
