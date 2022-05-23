import { BoxScore } from './BoxScore';
import { BoxScorePlayer } from './BoxScorePlayer';
import { HockeyAdvantageType } from './HockeyAdvantageType';
import { HockeyPosition } from './HockeyPosition';
import { HockeyShift } from './HockeyShift';

export class IceTimeRecord {
    id?: string;
    boxScore?: BoxScore;
    player?: BoxScorePlayer;
    shift?: HockeyShift;
    sequence?: number;
    startTime?: Date;
    endTime?: Date;
    periodStartTime?: number;
    periodEndTime?: number;
    position?: HockeyPosition;
    advantage?: HockeyAdvantageType;
    possessionTime?: number;
    touches?: number;
}
