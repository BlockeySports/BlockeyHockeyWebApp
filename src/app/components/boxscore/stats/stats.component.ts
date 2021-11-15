import { Component, Input, OnInit } from '@angular/core';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { Member } from 'src/app/models/Member';
import { PlayerStatistic } from 'src/app/models/PlayerStatistic';

@Component({
    selector: 'app-box-score-stats',
    templateUrl: './stats.component.html'
})
export class BoxScoreStatsComponent implements OnInit {

    @Input() isVisitor: boolean;
    @Input() pending: boolean;
    @Input() players: BoxScorePlayer[] = [];
    @Input() playerStatistics: PlayerStatistic[] = [];

    public MAX_VISIBLE_GOALS = 13;
    private LINE_HEIGHT = 1.625;

    constructor() { }

    ngOnInit(): void { }

    public getStats(): PlayerStatistic[] {
        return this.playerStatistics.filter(stat => this.isVisitor ? stat.team === 'away' : stat.team === 'home');
    }

    public getMaxVisibleStats(): number {
        return this.MAX_VISIBLE_GOALS;
    }

    public getMaxStatsHeight(): string {
        return `${this.MAX_VISIBLE_GOALS * this.LINE_HEIGHT + (2 / 16)}rem`;
    }

    public getProfileLink(member: Member): string {
        return window.location.origin + '/u/' + member.username;
    }

    public getDescription(): string {
        if (this.isVisitor) {
            return 'Visiting team player statistics';
        }
        return 'Home team player statistics';
    }

}
