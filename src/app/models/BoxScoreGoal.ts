import { Member } from './Member';

export class BoxScoreGoal {
    id?: string;
    boxScoreId?: string;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    goalScorer?: Member;
    ownGoalScorer?: Member;
    primaryAssistant?: Member;
    secondaryAssistant?: Member;

    isPowerPlay?: boolean;
    isExtraAttacker?: boolean;
    isPenaltyKill?: boolean;
    isShortHanded?: boolean;
    isEmptyNet?: boolean;
    isPenaltyShot?: boolean;
    isOwnGoal?: boolean;

    defendingPlayers?: Member[];
    attackingPlayers?: Member[];
}