import { Component, Input, OnInit } from '@angular/core';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { Member } from 'src/app/models/Member';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';

@Component({
    selector: 'app-box-score-stats',
    templateUrl: './stats.component.html'
})
export class BoxScoreStatsComponent implements OnInit {

    @Input() isVisitor: boolean;
    @Input() pending: boolean;
    @Input() players: BoxScorePlayer[] = [];
    @Input() playerStandings: PlayerLeaderboard[] = [];

    public MAX_VISIBLE_GOALS = 13;
    private LINE_HEIGHT = 1.625;

    constructor() { }

    ngOnInit(): void { }

    public getPlayers(): BoxScorePlayer[] {
        // if players is null, return
        if (!this.players) { return []; }
        // filter out duplicate players and sort by points descending
        return this.players.filter((player, index, self) =>
            index === self.findIndex((t) => (
                t.member.uuid === player.member.uuid
            ))
        ).sort((a, b) => {
            if (this.getPoints(a) > this.getPoints(b)) { return -1; }
            if (this.getPoints(a) < this.getPoints(b)) { return 1; }
            return 0;
        });
    }

    public getPlayerStandings(): PlayerLeaderboard[] {
        // get all box score players on the away team
        const awayPlayers = this.players.filter(player => player.team === 'away');
        // get all player standings for the away players
        return this.playerStandings.filter(player => awayPlayers.some(awayPlayer => awayPlayer.member.uuid === player.member.uuid));
    }

    public getGoals(player: BoxScorePlayer): number {
        // get goals from player standings where player id matched the box score player id
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.goals;
    }

    public getAssists(player: BoxScorePlayer): number {
        // get assists from player standings where player id matched the box score player id
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.primaryAssists
            + this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.secondaryAssists;
    }

    public getPoints(player: BoxScorePlayer): number {
        return this.getGoals(player) + this.getAssists(player);
    }

    public getShotsOnGoal(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.shotsOnGoal;
    }

    public getBlockedShots(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.blockedShots;
    }

    public getPlusMinus(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.plusMinus;
    }

    public getPenaltyMinutes(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.penaltyMinutes;
    }

    public getHits(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.hitsGiven;
    }

    public getShifts(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.shifts;
    }

    public getTimeOnIce(player: BoxScorePlayer): number {
        return this.playerStandings.find(playerStanding => playerStanding.member.uuid === player.member.uuid)?.timeOnIce;
    }

    public getMaxVisibleStats(): number {
        return this.MAX_VISIBLE_GOALS;
    }

    public getMaxStatsHeight(): string {
        return `${this.MAX_VISIBLE_GOALS * this.LINE_HEIGHT + (2 / 16)}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }

    public getDescription(): string {
        if (this.isVisitor) {
            return 'Visiting team player statistics';
        }
        return 'Home team player statistics';
    }
}
