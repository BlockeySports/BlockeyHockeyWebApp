import { BoxScore } from "./BoxScore";
import { HockeyTurnoverType } from "./HockeyTurnoverType";
import { IceTimeRecord } from "./IceTimeRecord";

export class HockeyTurnover {
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
    type?: HockeyTurnoverType;
}
