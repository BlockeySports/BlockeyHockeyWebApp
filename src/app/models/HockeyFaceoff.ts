import { BoxScore } from './BoxScore';
import { HockeyFaceoffDirection } from './HockeyFaceoffDirection';
import { HockeyZoneType } from './HockeyZoneType';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyFaceoff {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    awayPlayer?: IceTimeRecord;
    homePlayer?: IceTimeRecord;
    team?: string;
    direction?: HockeyFaceoffDirection;
    power?: number;
    zone?: HockeyZoneType;
    dot?: number;
    location?: string;
}
