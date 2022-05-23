import { BoxScore } from './BoxScore';
import { HockeyGoal } from './HockeyGoal';
import { HockeyShot } from './HockeyShot';
import { IceTimeRecord } from './IceTimeRecord';

export class ShootoutAttempt {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    team?: string;
    shooter?: IceTimeRecord;
    goaltender?: IceTimeRecord;
    shot?: HockeyShot;
    goal?: HockeyGoal;
}
