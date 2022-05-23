import { BoxScore } from './BoxScore';
import { IceTimeRecord } from './IceTimeRecord';

export class HockeyFight {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    initiatingTeam?: string;
    winningTeam?: string;
    awayFighter?: IceTimeRecord;
    homeFighter?: IceTimeRecord;
    awayPunches?: number;
    homePunches?: number;
    duration?: number;
    location?: string;
}
