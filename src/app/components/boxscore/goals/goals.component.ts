import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { BoxScoreGoal } from 'src/app/models/BoxScoreGoal';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { BoxScorePlayer } from 'src/app/models/BoxScorePlayer';
import { Member } from 'src/app/models/Member';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {

    @Input() boxScore: BoxScore;
    @Input() isVisitor: boolean;
    @Input() pending: boolean;

    public MAX_VISIBLE_GOALS = 13;
    private LINE_HEIGHT = 1.625;

    constructor() { }

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
        // if goal is null, stop here
        if (!goal) { return ''; }
        // define the goal type as blank
        let goalType = '';
        if (goal.isOwnGoal) {
            goalType += 'OWN';
            if (goal.isEmptyNet) { goalType += '/EN'; }
        } else {
            if (goal.isPowerPlay) {
                if (goalType && goalType.length > 0) { goalType += '/'; }
                goalType += 'PP';
            } else if (this.isExtraAttackerGoal(goal)) {
                if (goalType && goalType.length > 0) { goalType += '/'; }
                goalType += 'EA';
            }

            if (goal.isPenaltyKill) {
                if (goalType && goalType.length > 0) { goalType += '/'; }
                goalType += 'PK';
            } else if (this.isShortHandedGoal(goal)) {
                if (goalType && goalType.length > 0) { goalType += '/'; }
                goalType += 'SH';
            }

            if (this.isEmptyNetGoal(goal)) {
                if (goalType && goalType.length > 0) { goalType += '/'; }
                goalType += 'EN';
            }
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
        if (goal.period === 4) { return 'OT'; }
        return (goal.period - 3) + 'OT';
    }

    /**
     * Get the total number of players on the ice for a goal.
     * @param goal The box score goal.
     * @param team The to filer on.
     * @returns the total number of players on the ice for a goal
     */
    public getTotalOnIcePlayers(goal: BoxScoreGoal, team: string, includeGoaltender: boolean): number {
        return goal.onIcePlayers
            .filter(onIcePlayer => onIcePlayer.player.team.toLowerCase() === team.toLowerCase())
            .filter(onIcePlayer => includeGoaltender || onIcePlayer.player?.position?.toLowerCase() !== 'g')
            .length;
    }

    /**
     * Check if the goal is an extra attacker goal.
     */
    public isExtraAttackerGoal(goal: BoxScoreGoal): boolean {
        return this.getTotalOnIcePlayers(goal, goal.team, false) > this.getTotalOnIcePlayers(goal, goal.team === 'home' ? 'away' : 'home', false);
    }

    /**
     * Check if the goal is a short-handed goal.
     */
    public isShortHandedGoal(goal: BoxScoreGoal): boolean {
        return this.getTotalOnIcePlayers(goal, goal.team, false) < this.getTotalOnIcePlayers(goal, goal.team === 'home' ? 'away' : 'home', false);
    }

    /**
     * Check if the goal is an empty net goal.
     */
    public isEmptyNetGoal(goal: BoxScoreGoal): boolean {
        // search each on ice player in the goal for a player on the opposite team from the scoring team that is in the goaltender position
        return !goal.onIcePlayers.some(onIcePlayer => onIcePlayer.player.team.toLowerCase() === (goal.team === 'home' ? 'away' : 'home') && onIcePlayer.player.position.toLowerCase() === 'g');
    }

    public getMaxVisibleGoals(): number {
        return this.MAX_VISIBLE_GOALS - (this.boxScore?.isSeries ? 1 : 0);
    }

    public getMaxGoalsHeight(): string {
        return `${this.MAX_VISIBLE_GOALS * this.LINE_HEIGHT - (this.boxScore?.isSeries ? this.LINE_HEIGHT : 0) + (2 / 16)}rem`;
    }

    public getProfileLink(member: Member): string {
        return window.location.origin + '/u/' + member.username;
    }

    public getDescription(): string {
        if (this.isVisitor) {
            return 'Goals scored by the visiting team';
        }
        return 'Goals scored by the home team';
    }
}
