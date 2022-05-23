import { HockeySeason } from './HockeySeason';
import { HockeySeriesType } from './HockeySeriesType';
import { HockeyTournament } from './HockeyTournament';

export class HockeySeries {
    id?: string;
    season?: HockeySeason;
    tournament?: HockeyTournament;
    name?: string;
    description?: string;
    round?: number;
    type?: HockeySeriesType;
    date?: Date;
    isArchived?: boolean;
}
