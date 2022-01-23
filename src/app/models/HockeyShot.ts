import { BoxScore } from "./BoxScore";
import { HockeyGoal } from "./HockeyGoal";
import { IceTimeRecord } from "./IceTimeRecord";
import { ShootoutAttempt } from "./ShootoutAttempt";

export class HockeyShot {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    shotLocation?: string;
    endLocation?: string;
    team?: string;
    shotTaker?: IceTimeRecord;
    shotBlocker?: IceTimeRecord;
    goaltender?: IceTimeRecord;
    shotPower?: number;
    shotLift?: number;
    goal?: HockeyGoal;
    shootoutAttempt?: ShootoutAttempt;
    isGloved?: boolean;
    isBrokenStick?: boolean;
    isDeflection?: boolean;
    isOneTimer?: boolean;
}
