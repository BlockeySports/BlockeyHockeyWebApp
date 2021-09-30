import { Component, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/boxscore.service';
import { ColorService } from 'src/app/services/color.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

@Component({
    selector: 'app-scores',
    templateUrl: './scores.component.html'
})
export class ScoresComponent implements OnInit {

    public boxScores: BoxScore[] = [];

    constructor(
        private boxScoreService: BoxScoreService,
        private colorService: ColorService
    ) { }

    ngOnInit(): void {
        // set tab title
        document.title = 'Scores | Blockey Hockey Network';
        this.boxScoreService.getBoxScores().subscribe(
            (boxScores: BoxScore[]) => {
                this.boxScores = boxScores;
            },
            (error) => {
                document.title = 'Error Loading Scores | Blockey Hockey Network';
                console.log(error);
            }
        );
    }

    /**
     * Get the result of the game.
     */
    public getResult(boxScore: BoxScore): string {
        // if no goals, return 'Final'
        if (!boxScore.goals || boxScore.goals.length < 1) { return 'Final'; }
        // get last goal in goals array
        const period = boxScore.goals[boxScore.goals.length - 1].period;
        // if period is below 4, return 'Final'
        if (period < 4) { return 'Final'; }
        // if above 3, return final with OT period
        if (period === 4) { return 'Final / OT'; }
        return `Final / ${period - 3}OT`;
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
    public getNumberOfGoals(boxScore: BoxScore, isAway: boolean, period?: number): number {
        // if period was specified
        if (period != null) {
            // if away team
            if (isAway) {
                if (period <= 3) {
                    // return the number of goals for that period
                    return boxScore?.goals?.filter(g => g.period === period && g.team === 'away').length;
                } else {
                    // return number of goals scored in any period above 3
                    return boxScore?.goals?.filter(g => g.period > 3 && g.team === 'away').length;
                }
            }
            // if home team
            else {
                if (period <= 3) {
                    // return the number of goals for that period
                    return boxScore?.goals?.filter(g => g.period === period && g.team === 'home').length;
                } else {
                    // return number of goals scored in any period above 3
                    return boxScore?.goals?.filter(g => g.period > 3 && g.team === 'home').length;
                }
            }
        } else {
            // if away team
            if (isAway) {
                // return the number of goals for that period
                return boxScore?.goals?.filter(g => g.team === 'away').length;
            }
            // if home team
            else {
                // return the number of goals for that period
                return boxScore?.goals?.filter(g => g.team === 'home').length;
            }
        }
    }

    /**
     * Get the formatted date of the box score.
     */
    public getDate(boxScore: BoxScore): string {
        // format box score date as day of week, month day year, time am/pm
        dayjs.extend(localizedFormat);
        return dayjs(boxScore.date).format('dddd, MMMM D, YYYY, h:mm a');
    }

    /**
     * Get the link to an individual box score.
     */
    public getBoxScoreLink(boxScore: BoxScore): string {
        // return current domain and port with /b/{id}
        return `${window.location.origin}/b/${boxScore.id}`;
    }

    /**
     * Get the full name of a team.
     */
    public setTeamNameTooltip(boxScore: BoxScore, isAway: boolean): string {
        if (isAway) {
            // create the full name of the away team
            let awayTooltip = (boxScore?.awayTeam?.location || '') + ' ' + (boxScore?.awayTeam?.name || '');
            // if tooltip is empty, set to away team
            if (!awayTooltip.replace(' ', '')) { awayTooltip = 'Away Team'; }
            // return the tooltip
            return awayTooltip;
        } else {
            // create the full name of the home team
            let homeTooltip = (boxScore?.homeTeam?.location || '') + ' ' + (boxScore?.homeTeam?.name || '');
            // if tooltip is empty, set to home team
            if (!homeTooltip.replace(' ', '')) { homeTooltip = 'Home Team'; }
            // return the tooltip
            return homeTooltip;
        }
    }
}
