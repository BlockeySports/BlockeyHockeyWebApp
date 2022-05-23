import { HockeyLeague } from './HockeyLeague';
import { HockeyTournamentType } from './HockeyTournamentType';

export class HockeyTournament {
    id?: string;
    league?: HockeyLeague;
    name?: string;
    description?: string;
    value?: number;
    type?: HockeyTournamentType;
    date?: Date;
    isArchived?: boolean;
}
