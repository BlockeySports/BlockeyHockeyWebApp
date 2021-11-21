import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/boxscore.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TeamService } from 'src/app/services/team.service';
import { HockeyTeam } from 'src/app/models/HockeyTeam';
import { DateService } from 'src/app/services/date.service';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';

@Component({
    selector: 'app-boxscore',
    templateUrl: './boxscore.component.html'
})
export class BoxScoreComponent implements OnInit, OnDestroy {

    public isReadOnly = true;
    public pending = true;
    public boxScore: BoxScore = {
        id: '',
    };

    public teams: HockeyTeam[];
    public playerStatistics: PlayerStatistic[] = [];
    public playerStandings: PlayerLeaderboard[] = [];

    // subs
    public boxScoreSubscription: Subscription;
    public teamSubscription: Subscription;

    constructor(
        private boxScoreService: BoxScoreService,
        private teamService: TeamService,
        private dateService: DateService
    ) { }

    ngOnInit(): void {
        // get the username from the url
        this.boxScore.id = this.getBoxScoreIdFromURL();
        // if id is null, return
        if (!this.boxScore.id) { return; }
        // set temporary tab title
        document.title = 'Loading Box Score... | Blockey Hockey Network';
        // subscribe to the box score data
        this.boxScoreSubscription = this.boxScoreService.getBoxScore(this.boxScore.id).subscribe(
            (data: BoxScore) => {
                this.boxScore = data;
                // no longer pending
                this.pending = false;
                // set tab title to team codes
                if (data) {
                    document.title = this.boxScore?.awayTeam?.code + ' @ ' + this.boxScore?.homeTeam?.code
                        + ' | ' + this.getBoxScoreDate()
                        + ' | Blockey Hockey Network';
                } else {
                    document.title = 'Box Score Not Found | Blockey Hockey Network';
                }
            },
            (error) => {
                // set tab title to error
                document.title = 'Error Loading Box Score | Blockey Hockey Network';
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
        // get player standings for this box score
        this.boxScoreService.getPlayerStandings(this.boxScore.id).subscribe(
            (data: PlayerLeaderboard[]) => {
                this.playerStandings = data;
            },
            (error) => {
                console.log(error);
            }
        );
        // get the box score player statistics
        this.boxScoreService.getBoxScorePlayerStats(this.boxScore.id).subscribe(
            (data: PlayerStatistic[]) => {
                this.playerStatistics = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * Get the date from the box score from the date service.
     */
    public getDate(): Date {
        return this.dateService.getDate(this.boxScore.date);
    }

    /**
     * Get the box score date in a human-readable format.
     */
    public getBoxScoreDate(): string {
        // if pending box score information, return empty string
        if (this.pending || !this.boxScore?.date) { return ''; }
        dayjs.extend(localizedFormat);
        return dayjs(this.getDate()).format('MMM D, YYYY');
    }

    /**
     * Get the box score uuid from the url address
     * occurring after the last slash and before an fragments.
     */
    private getBoxScoreIdFromURL(): string {
        // get the 13 character code after the word 'boxscore' or 'b' in the url
        const uuid = window.location.href?.split('b/')[1]?.split('#')[0];
        // if the uuid is not 13 characters, return null
        if (!uuid || uuid.length !== 13) { return null; }
        // return the uuid
        return uuid;
    }

    public ngOnDestroy(): void {
        if (this.boxScoreSubscription) { this.boxScoreSubscription.unsubscribe(); }
        if (this.teamSubscription) { this.teamSubscription.unsubscribe(); }
    }
}
