import { BoxScore } from './BoxScore';
import { BoxScorePlayer } from './BoxScorePlayer';
import { HockeyStickColor } from './HockeyStickColor';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyShift {
    id?: string;
    boxScore?: BoxScore;
    player?: BoxScorePlayer;
    team?: string;
    stick?: HockeyStickColor;
    sequence?: number;
    period?: number;
    date?: Date;
    iceTimeRecords?: IceTimeRecord[];
}
