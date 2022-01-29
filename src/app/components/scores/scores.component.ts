import { Component, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreService } from 'src/app/services/box-score.service';
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
        // create the observer
        const observer = {
            next: (data: BoxScore[]) => {
                this.boxScores = data;
                console.log(this.boxScores);
            },
            error: err => {
                document.title = 'Error Loading Scores | Blockey Hockey Network';
                console.log(err);
            }
        };
        // subscribe to the observable
        this.boxScoreService.getBoxScores().subscribe(observer);
    }

    public getLeagueCode(boxScore: MiniBoxScore): string {
        return (boxScore.developmentPhase.value !== 3 ? boxScore?.developmentPhase?.name : boxScore?.league?.code).toUpperCase();
    }

    /**
     * Get the number of goals scored in a period.
     * @param boxScore The box score.
     * @param team The team to filter on.
     * @param period The period.
     * @returns the number of goals scored
     */
    public getScore(boxScore: MiniBoxScore, team: 'away' | 'home', period?: number): number {
        return boxScore?.periodSummaries
            ?.filter(periodSummary => !period || periodSummary?.period === period)
            ?.reduce((acc, periodSummary) => {
                return acc + (team === 'away' ? periodSummary?.awayGoals : periodSummary?.homeGoals);
            }, 0);
    }

    /**
     * Get the number of shots on goal for a team.
     * @param boxScore The box score.
     * @param team The team to filter on.
     * @returns the number of shots on goal
     */
    public getShotsOnGoal(boxScore: MiniBoxScore, team: 'away' | 'home'): number {
        return boxScore?.periodSummaries
            ?.reduce((acc, periodSummary) => {
                return acc + (team === 'away' ? periodSummary?.awayShotsOnGoal : periodSummary?.homeShotsOnGoal);
            }, 0);
    }

    /**
     * Check if the game went to overtime.
     * @param boxScore The box score.
     * @returns true if the game went to overtime, false otherwise
     */
    public isGameOvertime(boxScore: MiniBoxScore): boolean {
        return boxScore?.periodSummaries?.length > 3;
    }

    /**
     * Get the result of the game.
     * @param boxScore The box score.
     * @returns the result of the game
     */
    public getResult(boxScore: MiniBoxScore): string {
        // get last period number
        const lastPeriod = boxScore?.periodSummaries[boxScore?.periodSummaries?.length - 1]?.period;
        // if a fourth period exists, then it must have ended in overtime
        if (boxScore.periodSummaries.length === 4) return `FINAL / ${lastPeriod > 4 ? lastPeriod - 3 : ''}OT`;
        return 'FINAL';
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
