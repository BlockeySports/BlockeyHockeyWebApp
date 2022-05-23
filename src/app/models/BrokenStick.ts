import { BoxScore } from './BoxScore';
import { HockeyStickColor } from './HockeyStickColor';
import { IceTimeRecord } from './IceTimeRecord';

export class BrokenStick {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    player?: IceTimeRecord;
    stick?: HockeyStickColor;
    location?: string;
}
