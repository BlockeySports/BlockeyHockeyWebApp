import { Member } from './Member';

export class BoxScoreShootoutAttempt {
    id?: string;
    number?: number;
    team?: string;
    isGoal?: boolean;
    goalScorer?: Member;
    goaltender?: Member;
}
