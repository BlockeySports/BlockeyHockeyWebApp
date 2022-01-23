import { BoxScore } from './BoxScore';

export class HockeyPossessionTime {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    team?: string;
    offensiveZoneTime?: number;
    defensiveZoneTime?: number;
    neutralZoneTime?: number;
}
