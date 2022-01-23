import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { HockeyPeriodSummary } from 'src/app/models/HockeyPeriodSummary';
import { ColorService } from 'src/app/services/color.service';

@Component({
    selector: 'app-scoring-summary',
    templateUrl: './scoring-summary.component.html'
})
export class ScoringSummaryComponent implements OnInit {

    @Input() boxScore = new BoxScore();
    @Input() pending = true;

    constructor(
        private colorService: ColorService
    ) { }

    ngOnInit(): void { }

    /**
     * Get the number of goals scored by a team.  Optionally, a period can be specified to filter number of goals by period.
     * @param team The team to get goals for.
     * @param period The period to filter goals by (null if all periods).
     * @returns the number of goals scored by the team
     */
    public getNumberOfGoals(team: 'away' | 'home', period?: number): number {
        // if box score not loaded yet, return 0
        if (!this.boxScore?.shots) return 0;
        // return number of goals in box score for a team and period
        return this.boxScore?.goals
            ?.filter(goal => goal.team.toLowerCase() === team)
            .filter(goal => !period || goal.period === period)
            .length;
    }

    /**
     * Get the number of shots on goal for a team in a period.
     * @param team The team to get shots on goal for.
     * @param period The period to get shots on goal for (null if all periods).
     * @returns the number of shots on goal
     */
    public getShotsOnGoal(team: 'away' | 'home', period?: number): number {
        // if box score not loaded yet, return 0
        if (!this.boxScore?.shots) return 0;
        // return number of shots on goal in box score for a team and period
        return this.boxScore?.shots
            ?.filter(shot => shot?.team?.toLowerCase() === team)
            .filter(shot => !period || shot?.period === period)
            .filter(shot => !shot?.shotBlocker?.id)
            .length;
    }

    /**
     * Get the tippy tooltip text for a team in the period summary.
     * @param team The team to get the tooltip for.
     * @returns the tooltip text
     */
    public getTeamNameTooltip(team: 'away' | 'home'): string {
        // if away team but no team set yet, return 'Away Team'
        if (team === 'away' && !this.boxScore?.awayTeam) return 'Away Team';
        // if away team set, return away team's full name
        if (team === 'away') return (this.boxScore?.awayTeam?.location || '') + ' ' + (this.boxScore?.awayTeam?.name || '');
        // if home team but no team set yet, return 'Home Team'
        if (!this.boxScore?.homeTeam) return 'Home Team';
        // if home team set, return home team's full name
        return (this.boxScore?.homeTeam?.location || '') + ' ' + (this.boxScore?.homeTeam?.name || '');
    }

    /**
     * Get the number of periods played, excluding overtime periods past the first one.
     */
    public getNumberOfPeriods(): number {
        // if box score not loaded yet, return 0
        if (!this.boxScore?.periods) return 3;
        // if an overtime goal exits, return 4; otherwise, return 3
        return this.boxScore?.goals.find(goal => goal.period > 3) ? 4 : 3;
    }

    /**
     * Get the color that contrasts the background color.
     * @param backgroundColor The background color.
     * @returns the contrast color
     */
    public getContrastingColor(backgroundColor: string): string {
        return this.colorService.getContrast(backgroundColor);
    }
}
