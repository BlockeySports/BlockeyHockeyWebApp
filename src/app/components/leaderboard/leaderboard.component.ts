import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';
import { PlayerStatisticService } from 'src/app/services/player-statistic.service';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit, OnDestroy {

    public leaderboard: PlayerLeaderboard[] = [];

    // subscriptions
    private playerStatisticSubscription: Subscription;

    constructor(
        private playerStatisticService: PlayerStatisticService
    ) { }

    ngOnInit(): void {
        // set temporary tab title
        document.title = 'Loading Leaderboard... | Blockey Hockey Network';
        this.playerStatisticSubscription = this.playerStatisticService.getLeaderboard().subscribe(
            (data: PlayerLeaderboard[]) => {
                this.leaderboard = data;
                document.title = 'Leaderboard | Blockey Hockey Network';
            },
            (error: HttpErrorResponse) => {
                document.title = 'Error Loading Leaderboard | Blockey Hockey Network';
                console.log(error);
            }
        );
    }

    /**
     * Get total number of assists.
     */
    getAssists(player: PlayerLeaderboard): number {
        return player.primaryAssists + player.secondaryAssists;
    }

    /**
     * Get total number of points.
     */
    public getPoints(player: PlayerLeaderboard): number {
        return this.getAssists(player) + player.goals;
    }

    /**
     * Get average goals per game.
     */
    public getGoalsPerGame(player: PlayerLeaderboard): number {
        return player.goals / player.gamesPlayed;
    }

    /**
     * Get average assists per game.
     */
    public getAssistsPerGame(player: PlayerLeaderboard): number {
        return this.getAssists(player) / player.gamesPlayed;
    }

    /**
     * Get average points per game.
     */
    getPointsPerGame(player: PlayerLeaderboard): number {
        return this.getPoints(player) / player.gamesPlayed;
    }

    /**
     * Get average time on ice per game.
     */
    getAverageIceTime(player: PlayerLeaderboard): number {
        return player.timeOnIce;
    }

    /**
     * Get member profile link.
     */
    public getProfileLink(member: Member): string {
        return window.location.origin + '/u/' + member.username;
    }

    ngOnDestroy(): void {
        if (this.playerStatisticSubscription) this.playerStatisticSubscription.unsubscribe();
    }
}
