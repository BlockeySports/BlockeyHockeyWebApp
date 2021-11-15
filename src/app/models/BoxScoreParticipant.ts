import { BoxScore } from './BoxScore';
import { Member } from './Member';

export class BoxScoreParticipant {

    id?: string;
    boxScore?: BoxScore;
    member?: Member;
    date?: Date;
    lastJoin?: Date;
    duration?: number;
    favoriteTea?: string;
}
