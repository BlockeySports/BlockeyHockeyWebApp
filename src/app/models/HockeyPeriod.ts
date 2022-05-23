import { BoxScore } from "./BoxScore";
import { HockeyPeriodType } from "./HockeyPeriodType";

export class HockeyPeriod {
    id?: string;
    boxScore?: BoxScore;
    sequence?: number;
    number?: number;
    duration?: number;
    start?: Date;
    end?: Date;
    type?: HockeyPeriodType;
}
