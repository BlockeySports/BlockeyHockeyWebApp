import { BoxScore } from './BoxScore';
import { BrokenStick } from './BrokenStick';
import { HockeyShift } from './HockeyShift';
import { Member } from './Member';

export class BoxScorePlayer {
    id?: string;
    boxScore?: BoxScore;
    member?: Member;
    number?: number;
    date?: Date;
    dateUpdated?: Date;
    isPlayed?: boolean;
    shifts?: HockeyShift[];
    brokenSticks?: BrokenStick[];
}
