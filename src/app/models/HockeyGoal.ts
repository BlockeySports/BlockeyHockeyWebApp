import { BoxScore } from './BoxScore';
import { HockeyGoalType } from './HockeyGoalType';
import { HockeyShot } from './HockeyShot';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyGoal {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    shot?: HockeyShot;
    netLocation?: string;
    goalScorer?: IceTimeRecord;
    primaryAssistant?: IceTimeRecord;
    secondaryAssistant?: IceTimeRecord;
    ownGoalScorer?: IceTimeRecord;
    goaltender?: IceTimeRecord;
    goalType?: HockeyGoalType;
    isDisallowed?: string;
    onIcePlayers?: IceTimeRecord[];

    public static isShortHanded(goal: HockeyGoal): boolean {
        return HockeyGoal.getOnIcePlayers(goal, false, false)?.length < HockeyGoal.getOnIcePlayers(goal, true, false)?.length;
    }

    public static isExtraAttacker(goal: HockeyGoal): boolean {
        return HockeyGoal.getOnIcePlayers(goal, false, false)?.length > HockeyGoal.getOnIcePlayers(goal, true, false)?.length;
    }

    public static getOnIcePlayers(goal: HockeyGoal, fromOpponentTeam: boolean, includeGoaltender: boolean): IceTimeRecord[] {
        return goal.onIcePlayers
            .filter(player => fromOpponentTeam !== (player?.shift?.team?.toLowerCase() === goal.team))
            .filter(player => includeGoaltender || player.position.code !== 'G');
    }
}
