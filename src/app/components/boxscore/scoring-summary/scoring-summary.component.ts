import { Component, Input, OnInit } from '@angular/core';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { PlayerLeaderboard } from 'src/app/models/PlayerLeaderboard';
import { ColorService } from 'src/app/services/color.service';

@Component({
    selector: 'app-scoring-summary',
    templateUrl: './scoring-summary.component.html'
})
export class ScoringSummaryComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() players: BoxScorePlayer[] = [];
    @Input() playerStandings: PlayerLeaderboard[] = [];
    @Input() pending: boolean;

    constructor(
        private tippyService: NgxTippyService,
        private colorService: ColorService
    ) { }

    ngOnInit(): void {
        // set the tooltips
        this.setTeamNameTooltip();
    }

    /**
     * Get the color that contrasts the background color.
     * @param backgroundColor The background color.
     * @returns the contrast color
     */
    public getContrastingColor(backgroundColor: string): string {
        if (!backgroundColor) { return null; }
        return this.colorService.getContrast(backgroundColor);
    }

    /**
     * Get the number of goals scored by a team.  Optionally, a period can be specified to filter number of goals by period.
     * @param isAway True if the team is the away team; false if the team is the home team.
     * @param period The period to filter goals by.
     * @returns the number of goals scored by the team
     */
    public getNumberOfGoals(isAway: boolean, period?: number): number {
        // if pending still, return null
        if (this.pending) { return null; }
        // if period was specified
        if (period != null) {
            // if away team
            if (isAway) {
                if (period <= 3) {
                    // return the number of goals for that period
                    return this.boxScore?.goals?.filter(g => g.period === period && g.team === 'away').length;
                } else {
                    // return number of goals scored in any period above 3
                    return this.boxScore?.goals?.filter(g => g.period > 3 && g.team === 'away').length;
                }
            }
            // if home team
            else {
                if (period <= 3) {
                    // return the number of goals for that period
                    return this.boxScore?.goals?.filter(g => g.period === period && g.team === 'home').length;
                } else {
                    // return number of goals scored in any period above 3
                    return this.boxScore?.goals?.filter(g => g.period > 3 && g.team === 'home').length;
                }
            }
        } else {
            // if away team
            if (isAway) {
                // return the number of goals for that period
                return this.boxScore?.goals?.filter(g => g.team === 'away').length;
            }
            // if home team
            else {
                // return the number of goals for that period
                return this.boxScore?.goals?.filter(g => g.team === 'home').length;
            }
        }
    }

    /**
     * Get the full name of a team.
     */
    public setTeamNameTooltip(): void {
        setInterval(() => {
            // create the full name of the away team
            let awayTooltip = (this.boxScore?.awayTeam?.location || '') + ' ' + (this.boxScore?.awayTeam?.name || '');
            // if tooltip is empty, set to away team
            if (!awayTooltip.replace(' ', '')) { awayTooltip = 'Away Team'; }
            // set the tooltip
            this.tippyService.setContent('away-team-tippy', awayTooltip);
            // create the full name of the home team
            let homeTooltip = (this.boxScore?.homeTeam?.location || '') + ' ' + (this.boxScore?.homeTeam?.name || '');
            // if tooltip is empty, set to home team
            if (!homeTooltip.replace(' ', '')) { homeTooltip = 'Home Team'; }
            // set the tooltip
            this.tippyService.setContent('home-team-tippy', homeTooltip);
        }, 1000);
    }

    public getShotsOnGoal(team: 'away' | 'home'): number {
        if (this.pending) { return null; }
        // if away team
        let shotsOnGoal = 0;
        // for each box score player on the away team in players, get their total number of shots on goal from the matching player member uuid in player standings
        this.players.forEach(p => {
            shotsOnGoal += this.playerStandings.find(ps => p.team === team && ps.member.uuid === p.member.uuid)?.shotsOnGoal || 0;
        });
        return shotsOnGoal;
    }

    /**
     * Get the number of periods played, excluding overtime periods past the first one.
     */
    public getNumberOfPeriods(): number {
        if (this.boxScore?.goals?.some(goal => goal.period > 3)) return 4;
        return 3;
    }
}
