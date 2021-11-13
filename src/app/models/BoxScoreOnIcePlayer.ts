import { BoxScore } from './BoxScore';
import { BoxScoreGoal } from './BoxScoreGoal';
import { BoxScorePlayer } from './BoxScorePlayer';

export class BoxScoreOnIcePlayer {

    id?: string;
    boxScore?: BoxScore;
    player?: BoxScorePlayer;
    goal?: BoxScoreGoal;
    date?: Date;
    awayCount?: number;
    homeCount?: number;
}
