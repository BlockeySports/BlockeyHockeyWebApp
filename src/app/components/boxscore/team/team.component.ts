import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HockeyTeam } from 'src/app/models/HockeyTeam';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.95)' }),
                animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [
                animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))
            ])
        ])
    ]
})
export class TeamComponent implements OnInit {

    @Input() public isReadOnly: boolean;
    @Input() public team: HockeyTeam = {     // the selected hockey team
        name: '', location: ''
    };
    @Input() public isVisitor = false;
    @Input() public teams: HockeyTeam[] = []; // the list of all hockey teams from the database

    constructor() { }

    ngOnInit(): void {
    }

    /**
     * Set the selected team.
     * @param team The team to set.
     */
    public setTeam(team: HockeyTeam): void {
        this.team = team;
    }

    /**
     * Get team color.  If white, use black.
     * @param team The team to get the color for.
     * @returns the team color
     */
    public getTeamColor(): string {
        if (this.team.primaryColor === '#FFFFFF') { return '#000000'; }
        return this.team.primaryColor;
    }
}
