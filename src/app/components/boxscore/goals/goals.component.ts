import { Component, Input, OnInit } from '@angular/core';
import { BoxScore } from 'src/app/models/BoxScore';
import { HockeyGoal } from 'src/app/models/HockeyGoal';
import { IceTimeRecord } from 'src/app/models/IceTimeRecord';
import { Member } from 'src/app/models/Member';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
})
export class GoalsComponent implements OnInit {
  @Input() boxScore: BoxScore;
  @Input() isVisitor: boolean;
  @Input() pending: boolean;

  public MAX_VISIBLE_GOALS = 13;
  private LINE_HEIGHT = 1.625;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Get all goals scored for the team.
   * @returns all goals scored for the team
   */
  public getGoals(): HockeyGoal[] {
    return this.boxScore?.goals?.filter(g => (this.isVisitor ? g.team.toLowerCase() === 'away' : g.team.toLowerCase() === 'home'));
  }

  /**
   * Return the goal sequence scored by the team excluding disallowed goals.
   * @param goal The goal to get the sequence for.
   * @returns the goal sequence
   */
  public getGoalNumber(goal: HockeyGoal): number {
    // if this goal is disallowed
    if (goal.isDisallowed)
      return (
        this.getGoals()
          // filter out disallowed except this one
          .filter(g => !g.isDisallowed || g.id === goal.id)
          .indexOf(goal) + 1
      );
    // return this goal's index in the list of goals (excluding disallowed goals)
    return (
      this.getGoals()
        .filter(g => !g.isDisallowed)
        .indexOf(goal) + 1
    );
  }

  /**
   * Get goal type(s) for the goal.
   * @param goal The goal to get the type(s) for.
   * @returns the goal type(s)
   */
  public getGoalType(goal: HockeyGoal): string {
    // if goal is null, stop here
    if (!goal) {
      return '';
    }
    // define the goal type as blank
    let goalType = '';
    if (goal?.isDisallowed) return 'WAIVED';
    if (goal?.ownGoalScorer) {
      goalType += 'OWN';
      if (!goal?.goaltender) {
        goalType += '/EN';
      }
    } else {
      if (goal?.goalType?.abbreviation === 'PP') {
        if (goalType?.length > 0) {
          goalType += '/';
        }
        goalType += 'PP';
      } else if (HockeyGoal.isExtraAttacker(goal)) {
        if (goalType?.length > 0) {
          goalType += '/';
        }
        goalType += 'EA';
      }

      if (goal?.goalType?.abbreviation === 'PK') {
        if (goalType?.length > 0) {
          goalType += '/';
        }
        goalType += 'PK';
      } else if (HockeyGoal.isShortHanded(goal)) {
        if (goalType?.length > 0) {
          goalType += '/';
        }
        goalType += 'SH';
      }

      if (!goal?.goaltender) {
        if (goalType?.length > 0) {
          goalType += '/';
        }
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
  public getGoalTypeDescription(goal: HockeyGoal): string {
    let goalTypeDescription = goal?.isDisallowed ? 'Disallowed Goal' : '';
    if (goal?.goalType?.abbreviation === 'PP') {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += 'Power Play Goal';
    } else if (HockeyGoal.isExtraAttacker(goal)) {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += 'Extra Attacker Goal';
    }
    if (goal?.goalType?.abbreviation === 'PK') {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += 'Penalty Kill Goal';
    } else if (HockeyGoal.isShortHanded(goal)) {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += 'Short Handed Goal';
    }
    if (!goal.goaltender) {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += 'Empty Net Goal';
    }
    if (goal.ownGoalScorer) {
      if (goalTypeDescription?.length > 0) {
        goalTypeDescription += '/';
      }
      goalTypeDescription += `Own Goal (${goal?.ownGoalScorer?.player?.member?.username})`;
    }
    return goalTypeDescription;
  }

  /**
   * Get the period of the goal and convert overtime periods.
   * @param goal The goal to get the period for.
   * @returns the period of the goal
   */
  public getPeriod(goal: HockeyGoal): string {
    if (goal.period < 4) {
      return goal.period.toString();
    }
    if (goal.period === 4) {
      return 'OT';
    }
    return goal.period - 3 + 'OT';
  }

  public getMaxVisibleGoals(): number {
    return this.MAX_VISIBLE_GOALS - (this.boxScore?.series ? 1 : 0);
  }

  public getMaxGoalsHeight(): string {
    return `${this.MAX_VISIBLE_GOALS * this.LINE_HEIGHT - (this.boxScore?.series ? this.LINE_HEIGHT : 0) + 2 / 16}rem`;
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
