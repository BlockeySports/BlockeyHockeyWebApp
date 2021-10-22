import { Member } from './Member';

export class BoxScorePlayer {
    boxScoreId?: string;
    member?: Member;
    date?: Date;
    team?: string;
    isPrimaryTeam?: boolean;
    isPlayed?: boolean;
    position?: string;
    number?: number;
    timeOnIce?: number;
}
