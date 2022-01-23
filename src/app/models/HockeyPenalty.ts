import { BoxScore } from "./BoxScore";
import { HockeyGoal } from "./HockeyGoal";
import { HockeyInfractionType } from "./HockeyInfractionType";
import { HockeyPenaltyType } from "./HockeyPenaltyType";
import { IceTimeRecord } from "./IceTimeRecord";

export class HockeyPenalty {
    id?: string;
    boxScore?: BoxScore;
    date?: Date;
    sequence?: number;
    period?: number;
    periodTime?: number;
    team?: string;
    offender?: IceTimeRecord;
    offended?: IceTimeRecord;
    served?: IceTimeRecord;
    duration?: number;
    type?: HockeyPenaltyType;
    infraction?: HockeyInfractionType;
    location?: string;
    isCoincidental?: boolean;
    goals?: HockeyGoal[];
}
