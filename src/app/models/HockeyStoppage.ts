import { BoxScore } from './BoxScore';
import { HockeyStoppageType } from './HockeyStoppageType';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyStoppage {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    player?: IceTimeRecord;
    location?: string;
    type?: HockeyStoppageType;
    isIntentional?: boolean;
}
