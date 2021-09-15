import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { ColorService } from 'src/app/services/color.service';

@Component({
    selector: 'app-scoring-summary',
    templateUrl: './scoring-summary.component.html'
})
export class ScoringSummaryComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() pending: boolean;

    constructor(
        private colorService: ColorService
    ) { }

    ngOnInit(): void { }

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
    public getFullTeamName(isAway: boolean): string {
        // if pending still, return null
        if (this.pending) { return null; }
        // if away team
        if (isAway) {
            // return the full name of the away team
            return this.boxScore?.awayTeam?.location + ' ' + this.boxScore?.awayTeam?.name;
        }
        // if home team
        else {
            // return the full name of the home team
            return this.boxScore?.homeTeam?.location + ' ' + this.boxScore?.homeTeam?.name;
        }
    }

    //TODO: fix full name tippy above
}
