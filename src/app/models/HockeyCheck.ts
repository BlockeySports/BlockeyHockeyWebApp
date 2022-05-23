import { BoxScore } from './BoxScore';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyCheck {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    player?: IceTimeRecord;
    opponent?: IceTimeRecord;
    location?: string;
    force?: number;
}
