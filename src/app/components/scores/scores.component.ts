import { Component, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/boxscore.service';
import { ColorService } from 'src/app/services/color.service';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DateService } from 'src/app/services/date.service';
import { MiniBoxScore } from 'src/app/models/MiniBoxScore';

@Component({
    selector: 'app-scores',
    templateUrl: './scores.component.html'
})
export class ScoresComponent implements OnInit {

    public boxScores: MiniBoxScore[] = [];

    constructor(
        private boxScoreService: BoxScoreService,
        private colorService: ColorService,
        private dateService: DateService
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
     * Get the total number of goals scored by a team in the game.
     * @param boxScore The box score.
     * @param team The team to filter on.
     */
    public getTotalGoals(boxScore: MiniBoxScore, team: string): number {
        if (team === 'away') return boxScore.firstPeriodAwayGoals + boxScore.secondPeriodAwayGoals + boxScore.thirdPeriodAwayGoals + boxScore.overtimeAwayGoals;
        else if (team === 'home') return boxScore.firstPeriodHomeGoals + boxScore.secondPeriodHomeGoals + boxScore.thirdPeriodHomeGoals + boxScore.overtimeHomeGoals;
        else return 0;
    }

    /**
     * Get the number of goals scored in a period.
     * @param boxScore The box score.
     * @param team The team to filter on.
     * @param period The period.
     */
    public getGoalsByPeriod(boxScore: MiniBoxScore, team: string, period: number): number {
        if (team === 'away') {
            switch (period) {
                case 1: return boxScore.firstPeriodAwayGoals;
                case 2: return boxScore.secondPeriodAwayGoals;
                case 3: return boxScore.thirdPeriodAwayGoals;
                default: return boxScore.overtimeAwayGoals;
            }
        } else if (team === 'home') {
            switch (period) {
                case 1: return boxScore.firstPeriodHomeGoals;
                case 2: return boxScore.secondPeriodHomeGoals;
                case 3: return boxScore.thirdPeriodHomeGoals;
                default: return boxScore.overtimeHomeGoals;
            }
        } else return 0;
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
     * Get the formatted date of the box score.
     */
    public getDate(boxScore: BoxScore): string {
        // format box score date as day of week, month day year, time am/pm
        // dayjs.extend(localizedFormat);
        return dayjs(this.dateService.getDate(boxScore.date)).format('dddd, MMMM D, YYYY, h:mm a');
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
