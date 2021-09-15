import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreGoal } from 'src/app/models/BoxScoreGoal';
import { NgxTippyService } from 'ngx-tippy-wrapper';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() isVisitor: boolean;
    @Input() pending: boolean;

    public MAX_VISIBLE_GOALS = 15;

    constructor(
        private tippyService: NgxTippyService
    ) { }

    ngOnInit(): void { }

    /**
     * Get all goals scored for the team.
     * @returns all goals scored for the team
     */
    public getGoals(): BoxScoreGoal[] {
        return this.boxScore?.goals?.filter(g => this.isVisitor ? g.team === 'away' : g.team === 'home');
    }

    /**
     * Get goal type(s) for the goal.
     * @param goal The goal to get the type(s) for.
     * @returns the goal type(s)
     */
    public getGoalType(goal: BoxScoreGoal): string {
        let goalType = '';
        if (goal.isPowerPlay) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'PP';
        } else if (goal.isExtraAttacker) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'EA';
        }

        if (goal.isPenaltyKill) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'PK';
        } else if (goal.isShortHanded) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'SH';
        }

        if (goal.isEmptyNet) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'EN';
        }

        if (goal.isOwnGoal) {
            if (goalType && goalType.length > 0) { goalType += '/'; }
            goalType += 'OWN';
        }
        return goalType;
    }

    /**
     * Get the description of the goal type(s).
     * Used to display the tooltip.
     * @param goal The goal to get the description for.
     * @returns the description of the goal type(s)
     */
    public getGoalTypeDescription(goal: BoxScoreGoal): string {
        let goalTypeDescription = '';
        if (goal.isPowerPlay) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Power Play Goal';
        } else if (goal.isExtraAttacker) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Extra Attacker Goal';
        }

        if (goal.isPenaltyKill) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Penalty Kill Goal';
        } else if (goal.isShortHanded) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Short Handed Goal';
        }

        if (goal.isEmptyNet) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Empty Net Goal';
        }

        if (goal.isOwnGoal) {
            if (goalTypeDescription && goalTypeDescription.length > 0) { goalTypeDescription += '/'; }
            goalTypeDescription += 'Own Goal';
        }
        return goalTypeDescription;
    }

    /**
     * Get the period of the goal and convert overtime periods.
     * @param goal The goal to get the period for.
     * @returns the period of the goal
     */
    public getGoalPeriod(goal: BoxScoreGoal): string {
        if (goal.period < 4) { return goal.period.toString(); }
        return (goal.period - 3) + 'OT';
    }

    public getMaxGoalsHeight(): string {
        return `${this.MAX_VISIBLE_GOALS * 1.625 + 1.625}rem`;
    }

    public getProfileLink(username: string): string {
        return window.location.origin + '/u/' + username;
    }
}
