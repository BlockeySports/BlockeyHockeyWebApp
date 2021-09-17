import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/boxscore.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TeamService } from 'src/app/services/team.service';
import { HockeyTeam } from 'src/app/models/HockeyTeam';

@Component({
    selector: 'app-boxscore',
    templateUrl: './boxscore.component.html',
    styleUrls: ['./boxscore.component.css']
})
export class BoxScoreComponent implements OnInit, OnDestroy {

    public isReadOnly = true;
    public pending = true;
    public boxScore: BoxScore = {
        uuid: '',
    };

    public teams: HockeyTeam[];

    // subs
    public boxScoreSubscription: Subscription;
    public teamSubscription: Subscription;

    constructor(
        private boxScoreService: BoxScoreService,
        private teamService: TeamService
    ) { }

    ngOnInit(): void {
        // get the username from the url
        this.boxScore.uuid = this.getUuidFromAddress();
        // set temporary tab title
        document.title = 'Loading Box Score...';
        // subscribe to the box score data
        this.boxScoreSubscription = this.boxScoreService.getBoxScore(this.boxScore.uuid).subscribe(
            (data: BoxScore) => {
                this.boxScore = data;
                // no longer pending
                this.pending = false;
                // set tab title to team codes
                document.title = this.boxScore?.awayTeam?.code + ' @ ' + this.boxScore?.homeTeam?.code + ' | ' + this.getBoxScoreDate();
                console.log(this.boxScore);
            },
            (error) => {
                console.log(error);
            }
        );
        // subscribe to the team data
        this.teamSubscription = this.teamService.getHockeyTeams().subscribe(
            (data: HockeyTeam[]) => {
                this.teams = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * Get the box score date in a human-readable format.
     */
    public getBoxScoreDate(): string {
        // if pending box score information, return empty string
        if (this.pending) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.boxScore.gameTime).format('MMM D, YYYY');
    }

    /**
     * Get the box score uuid from the url address
     * occurring after the last slash and before an fragments.
     */
    private getUuidFromAddress(): string {
        const url = window.location.href;
        const lastSlash = url.lastIndexOf('/');
        // in case a fragment exists in url, only take everything before that
        return url.substr(lastSlash + 1).split('#')[0];
    }

    public ngOnDestroy(): void {
        if (this.boxScoreSubscription) { this.boxScoreSubscription.unsubscribe(); }
        if (this.teamSubscription) { this.teamSubscription.unsubscribe(); }
    }
}
