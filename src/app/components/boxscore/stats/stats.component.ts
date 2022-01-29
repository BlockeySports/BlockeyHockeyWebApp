import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { HockeyPlayerStatistic } from 'src/app/models/HockeyPlayerStatistic';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';

@Component({
    selector: 'app-box-score-stats',
    templateUrl: './stats.component.html'
})
export class BoxScoreStatsComponent implements OnInit {

    @Input() team: string;
    @Input() pending: boolean;
    @Input() boxScore: BoxScore;
    @Input() stats: HockeyPlayerStatistic[];

    public MAX_VISIBLE_PLAYERS = 7;
    private LINE_HEIGHT = 1.625;

    constructor() { }

    ngOnInit(): void { }

    public getPlayers(): BoxScorePlayer[] {
        // if box score is not loaded, return empty array
        if (!this.boxScore?.players) { return []; }
        // return the players for the specified team
        return this.boxScore?.players
            .filter(player => player.shifts.flatMap(shift => shift.team.toLowerCase()).includes(this.team.toLowerCase()));
    }

    public getStats(): HockeyPlayerStatistic[] {
        // get box score players for the correct team
        const boxScorePlayers = this.getPlayers();
        // return stats that have the same member as the box score player's member
        return this.stats
            ?.filter(stat => stat?.filter?.teamType.toLowerCase() === this.team?.toLowerCase())
            ?.filter(stat => boxScorePlayers.find(player => player?.member?.uuid === stat?.member?.uuid));
    }

    public getGoals(stat: HockeyPlayerStatistic): number {
        return stat.points.map(pointsStat => pointsStat.goals).reduce((a, b) => a + b);
    }

    public getAssists(stat: HockeyPlayerStatistic): number {
        return stat.points.map(pointsStat => pointsStat.primaryAssists + pointsStat.secondaryAssists).reduce((a, b) => a + b);
    }

    public getPoints(stat: HockeyPlayerStatistic): number {
        return this.getGoals(stat) + this.getAssists(stat);
    }

    public getMaxVisibleStats(): number {
        return this.MAX_VISIBLE_PLAYERS;
    }

    public getMaxStatsHeight(): string {
        return `${this.MAX_VISIBLE_PLAYERS * this.LINE_HEIGHT + (2 / 16)}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }

    public getDescription(): string {
        if (this.team === 'away') return 'Visiting team player statistics';
        return 'Home team player statistics';
    }
}
