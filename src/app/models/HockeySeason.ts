import { HockeyLeague } from './HockeyLeague';

export class HockeySeason {
    id?: string;
    league?: HockeyLeague;
    name?: string;
    description?: string;
    value?: number;
    date?: Date;
    isArchived?: boolean;
}
